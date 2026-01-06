import { prisma } from "../configs/prisma.js";
import { createSlug } from "../utils/slugUtil.js";
import { enrichProductWithFlags } from "../utils/productUtil.js";
import { cleanProductDescription } from "../utils/sanitizerUtil.js";
import { EmailTemplates, sendEmail } from "../configs/nodemailer.js";

const ProductService = {
  createProduct: async ({ userId, product }) => {
    if (product.buyNowPrice !== undefined && product.buyNowPrice !== null) {
      if (product.buyNowPrice <= product.startPrice) {
        throw new Error("Buy now price must be greater than start price");
      }
    }

    const category = await prisma.category.findUnique({
      where: { id: product.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const seller = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!seller) {
      throw new Error("Seller not found");
    }

    if (product.slug === undefined || product.slug === null) {
      const baseSlug = createSlug(product.name);
      let slug = baseSlug;
      let count = 1;

      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count++}`;
      }

      product.slug = slug;
    }

    const cleanDescription = cleanProductDescription(product.description);

    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: cleanDescription,
        slug: product.slug,
        categoryId: product.categoryId,
        sellerId: userId,
        startPrice: product.startPrice,
        stepPrice: product.stepPrice,
        buyNowPrice: product.buyNowPrice || null,
        currentPrice: product.startPrice,
        endDate: product.endDate,
        isAutoExtend: product.isAutoExtend,
        isInstantPurchase: product.isInstantPurchase,
        minImages: product.minImages || null,
        images: {
          create: product.images,
        },
      },
      include: {
        images: {
          omit: { productId: true },
        },
      },
    });

    return newProduct;
  },

  getProducts: async (
    { page, limit, categoryIds, sortBy, order, keyword },
    userId
  ) => {
    const skip = (page - 1) * limit;

    const hasCategories = Array.isArray(categoryIds) && categoryIds.length > 0;

    if (keyword) {
      let orderBy = "ORDER BY p.created_at DESC";

      if (sortBy === "endDate") {
        orderBy = `ORDER BY p.end_date ${order?.toUpperCase() ?? "ASC"}`;
      }

      if (sortBy === "currentPrice") {
        orderBy = `ORDER BY p.current_price ${order?.toUpperCase() ?? "DESC"}`;
      }

      const rawCategoryParams = hasCategories ? categoryIds : null;

      const data = await prisma.$queryRawUnsafe(
        `
          SELECT
            p.id, p.name, p.winner_id,
            pf.user_name, pf.full_name,
            p.current_price, p.buy_now_price,
            p.post_date, p.end_date,
            COUNT(b.id)::int AS bid_count,
            COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'id', i.id,
                  'url', i.url,
                  'isPrimary', i.is_primary,
                  'createdAt', i.created_at
                )
                ORDER BY i.created_at DESC
              ) FILTER (WHERE i.id IS NOT NULL), '[]'
            ) AS images
          FROM products p
          JOIN categories c ON c.id = p.category_id
          LEFT JOIN profiles pf ON pf.id = p.winner_id
          LEFT JOIN bids b ON b.product_id = p.id
          LEFT JOIN product_images i ON i.product_id = p.id
          WHERE
            ($1::int[] IS NULL OR p.category_id = ANY($1::int[]))
            AND (
              p.search_vector @@ plainto_tsquery('english', $2)
              OR c.search_vector @@ plainto_tsquery('english', $2)
              OR p.name ILIKE '%' || $2 || '%'
              OR c.name ILIKE '%' || $2 || '%'
            )
          GROUP BY
            p.id, p.name, p.winner_id,
            pf.user_name, pf.full_name,
            p.current_price, p.buy_now_price,
            p.post_date, p.end_date
          ${orderBy}
          LIMIT $3
          OFFSET $4
        `,
        rawCategoryParams,
        keyword,
        limit,
        skip
      );

      const total = await prisma.$queryRawUnsafe(
        `
          SELECT COUNT(DISTINCT p.id)::int AS count
          FROM products p
          JOIN categories c ON c.id = p.category_id
          WHERE
            ($1::int[] IS NULL OR p.category_id = ANY($1::int[]))
            AND (
              p.search_vector @@ plainto_tsquery('english', $2)
              OR c.search_vector @@ plainto_tsquery('english', $2)
              OR p.name ILIKE '%' || $2 || '%'
              OR c.name ILIKE '%' || $2 || '%'
            )
        `,
        rawCategoryParams,
        keyword
      );

      const totalCount = Number(total[0].count);

      const formattedData = data.map((p) => ({
        id: p.id,
        name: p.name,
        currentPrice: p.current_price,
        buyNowPrice: p.buy_now_price,

        postDate: p.post_date,
        endDate: p.end_date,

        winner: p.winner_id
          ? {
              id: p.winner_id,
              username: p.user_name,
              fullName: p.full_name,
            }
          : null,

        _count: {
          bids: p.bid_count,
        },

        images: p.images
          ? p.images.filter((img) => img.isPrimary === true)
          : [],
      }));

      let watchedProductIds = new Set();

      if (userId) {
        const watchlist = await prisma.watchlist.findMany({
          where: { userId },
          select: { productId: true },
        });

        watchedProductIds = new Set(watchlist.map((w) => w.productId));
      }

      const enrichedProducts = await Promise.all(
        formattedData.map((product) =>
          enrichProductWithFlags(product, watchedProductIds.has(product.id))
        )
      );

      return {
        products: enrichedProducts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }

    const where = {
      ...(hasCategories && { categoryId: { in: categoryIds } }),
    };

    const orderBy =
      sortBy && order ? { [sortBy]: order } : { createdAt: "desc" };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          winner: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
          _count: {
            select: { bids: true },
          },
          images: {
            where: { isPrimary: true },
            omit: { productId: true },
          },
        },
        omit: { winnerId: true },
      }),
      prisma.product.count({ where }),
    ]);

    let watchedProductIds = new Set();

    if (userId) {
      const watchlist = await prisma.watchlist.findMany({
        where: { userId },
        select: { productId: true },
      });

      watchedProductIds = new Set(watchlist.map((w) => w.productId));
    }

    const enrichedProducts = await Promise.all(
      data.map((product) =>
        enrichProductWithFlags(product, watchedProductIds.has(product.id))
      )
    );

    return {
      products: enrichedProducts,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getProductById: async (id, userId) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        winner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
        images: {
          omit: { productId: true },
        },
      },
      omit: { winnerId: true, sellerId: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    let watchedProductIds = new Set();

    if (userId) {
      const watchlist = await prisma.watchlist.findMany({
        where: { userId },
        select: { productId: true },
      });

      watchedProductIds = new Set(watchlist.map((w) => w.productId));
    }

    return enrichProductWithFlags(product, watchedProductIds.has(product.id));
  },

  getRelatedProducts: async (productId, categoryId) => {
    return await prisma.product.findMany({
      where: {
        categoryId: categoryId,
        id: { not: productId },
      },
      take: 5,
      include: {
        winner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
        images: {
          omit: { productId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getHomeProducts: async (userId) => {
    const include = {
      winner: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
      _count: {
        select: {
          bids: true,
        },
      },
      images: {
        where: { isPrimary: true },
        omit: { productId: true },
      },
    };

    const [endingSoon, mostBids, highestPrice] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "active",
          endDate: { gt: new Date() },
        },
        orderBy: { endDate: "asc" },
        take: 5,
        include,
        omit: { winnerId: true },
      }),

      prisma.product.findMany({
        where: {
          status: "active",
          endDate: { gt: new Date() },
        },
        orderBy: {
          bids: { _count: "desc" },
        },
        take: 5,
        include,
        omit: { winnerId: true },
      }),

      prisma.product.findMany({
        where: {
          status: "active",
          endDate: { gt: new Date() },
        },
        orderBy: { currentPrice: "desc" },
        take: 5,
        include,
        omit: { winnerId: true },
      }),
    ]);

    const products = [...endingSoon, ...mostBids, ...highestPrice];
    const endingSoonLength = endingSoon.length;
    const mostBidsLength = mostBids.length;
    const highestPriceLength = highestPrice.length;

    let watchedProductIds = new Set();

    if (userId) {
      const watchlist = await prisma.watchlist.findMany({
        where: { userId },
        select: { productId: true },
      });

      watchedProductIds = new Set(watchlist.map((w) => w.productId));
    }

    const enrichedProducts = await Promise.all(
      products.map((product) =>
        enrichProductWithFlags(product, watchedProductIds.has(product.id))
      )
    );

    return {
      endingSoon: enrichedProducts.slice(0, endingSoonLength),
      mostBids: enrichedProducts.slice(
        endingSoonLength,
        endingSoonLength + mostBidsLength
      ),
      highestPrice: enrichedProducts.slice(
        endingSoonLength + mostBidsLength,
        endingSoonLength + mostBidsLength + highestPriceLength
      ),
    };
  },

  getActiveProductsByUserId: async (userId) => {
    return await prisma.product.findMany({
      where: {
        sellerId: userId,
        status: "active",
      },
      include: {
        _count: {
          select: { bids: true },
        },
        images: {
          where: { isPrimary: true },
          omit: { productId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getSoldProductsByUserId: async (userId) => {
    return await prisma.product.findMany({
      where: {
        sellerId: userId,
        status: "sold",
      },
      include: {
        winner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
        ratings: {
          where: { type: "seller_bidder" },
        },
        transactions: {
          select: {
            id: true,
            status: true,
          },
        },
        images: {
          where: { isPrimary: true },
          omit: { productId: true },
        },
      },
      orderBy: { createdAt: "desc" },
      omit: { winnerId: true },
    });
  },

  getWonProductsByUserId: async (userId) => {
    return await prisma.product.findMany({
      where: {
        winnerId: userId,
        status: "sold",
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
        ratings: {
          where: { type: "bidder_seller" },
        },
        transactions: {
          select: {
            id: true,
            status: true,
          },
        },
        images: {
          where: { isPrimary: true },
          omit: { productId: true },
        },
      },
      orderBy: { createdAt: "desc" },
      omit: { sellerId: true },
    });
  },

  getProductAnalysisByUserId: async (userId) => {
    const [activeCount, soldCount, revenue] = await Promise.all([
      prisma.product.count({
        where: {
          sellerId: userId,
          status: "active",
        },
      }),

      prisma.product.count({
        where: {
          sellerId: userId,
          status: "sold",
        },
      }),

      prisma.product.aggregate({
        where: {
          sellerId: userId,
          status: "sold",
        },
        _sum: { currentPrice: true },
      }),
    ]);

    return {
      activeCount,
      soldCount,
      totalRevenue: revenue._sum.currentPrice ?? 0,
    };
  },

  updateProduct: async ({
    id,
    description,
    isAutoExtend,
    isInstantPurchase,
  }) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: { fullName: true, username: true },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.status !== "active" || new Date(product.endDate) < new Date()) {
      throw new Error("Cannot update product after auction has ended");
    }

    const changes = [];

    if (description && description !== product.description) {
      changes.push("Update product description");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { description, isAutoExtend, isInstantPurchase },
    });

    if (changes.length > 0) {
      const bidders = await prisma.bid.findMany({
        where: { productId: id },
        distinct: ["bidderId"],
        include: {
          bidder: {
            select: { email: true, fullName: true },
          },
        },
      });

      const changeSummary = changes.map((c) => `• ${c}`).join("\n");

      for (const bid of bidders) {
        if (!bid.bidder?.email) {
          continue;
        }

        const emailData = {
          bidderName: bid.bidder.fullName || "there",
          productName: product.name,
          sellerName: product.seller.fullName || product.seller.username,
          changeSummary,
          updatedAt: new Date().toLocaleString("vi-VN"),
          productUrl: `${process.env.CLIENT_URL}/products/${product.id}`,
          platformName: "Auctiva",
        };

        const html = EmailTemplates.productUpdate(emailData);

        await sendEmail({
          to: bid.bidder.email,
          subject: `Product Update Notification: ${product.name}`,
          html,
        });
      }
    }

    return updatedProduct;
  },

  deleteProduct: async (id) => {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id },
    });
  },
};

export default ProductService;
