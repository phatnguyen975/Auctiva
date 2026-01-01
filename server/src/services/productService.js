import sanitizeHtml from "sanitize-html";
import { prisma } from "../configs/prisma.js";
import { createSlug } from "../utils/slugUtil.js";
import { enrichProductWithFlags } from "../utils/productUtil.js";

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

    const cleanDescription = sanitizeHtml(product.description, {
      allowedTags: sanitizeHtml.defaults.allowedTags,
      allowedAttributes: false,
    });

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

  getProducts: async ({ page, limit, categoryId, sortBy, order, keyword }) => {
    const skip = (page - 1) * limit;

    if (keyword) {
      let orderBy = "ORDER BY p.created_at DESC";

      if (sortBy === "endDate") {
        orderBy = `ORDER BY p.end_date ${order?.toUpperCase() ?? "ASC"}`;
      }

      if (sortBy === "currentPrice") {
        orderBy = `ORDER BY p.current_price ${order?.toUpperCase() ?? "DESC"}`;
      }

      const data = await prisma.$queryRawUnsafe(
        `
          SELECT
            p.id,
            p.seller_id,
            p.category_id,
            p.winner_id,
            pf.user_name,
            pf.full_name,
            p.name,
            p.description,
            p.slug,
            p.start_price,
            p.step_price,
            p.buy_now_price,
            p.current_price,
            p.post_date,
            p.end_date,
            p.is_auto_extend,
            p.is_instant_purchase,
            p.is_new,
            p.status,
            p.min_images,
            p.created_at,
            p.updated_at,
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
              ) FILTER (WHERE i.id IS NOT NULL),
              '[]'
            ) AS images
          FROM products p
          JOIN categories c ON c.id = p.category_id
          LEFT JOIN profiles pf ON pf.id = p.winner_id
          LEFT JOIN bids b ON b.product_id = p.id
          LEFT JOIN product_images i ON i.product_id = p.id
          WHERE
            ($1::int IS NULL OR p.category_id = $1)
            AND (
              p.search_vector @@ plainto_tsquery('english', $2)
              OR c.search_vector @@ plainto_tsquery('english', $2)
              OR p.name ILIKE '%' || $2 || '%'
              OR c.name ILIKE '%' || $2 || '%'
            )
          GROUP BY
            p.id,
            p.seller_id,
            p.category_id,
            p.winner_id,
            pf.user_name,
            pf.full_name,
            p.name,
            p.description,
            p.slug,
            p.start_price,
            p.step_price,
            p.buy_now_price,
            p.current_price,
            p.post_date,
            p.end_date,
            p.is_auto_extend,
            p.is_instant_purchase,
            p.is_new,
            p.status,
            p.min_images,
            p.created_at,
            p.updated_at
          ${orderBy}
          LIMIT $3
          OFFSET $4
        `,
        categoryId ?? null,
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
            ($1::int IS NULL OR p.category_id = $1)
            AND (
              p.search_vector @@ plainto_tsquery('english', $2)
              OR c.search_vector @@ plainto_tsquery('english', $2)
              OR p.name ILIKE '%' || $2 || '%'
              OR c.name ILIKE '%' || $2 || '%'
            )
        `,
        categoryId ?? null,
        keyword
      );

      const totalCount = Number(total[0].count);
      const formattedData = data.map((p) => ({
        id: p.id,
        sellerId: p.seller_id,
        categoryId: p.category_id,

        name: p.name,
        description: p.description,
        slug: p.slug,

        startPrice: p.start_price,
        stepPrice: p.step_price,
        buyNowPrice: p.buy_now_price,
        currentPrice: p.current_price,

        postDate: p.post_date,
        endDate: p.end_date,

        isAutoExtend: p.is_auto_extend,
        isInstantPurchase: p.is_instant_purchase,
        isNew: p.is_new,

        status: p.status,
        minImages: p.min_images,

        createdAt: p.created_at,
        updatedAt: p.updated_at,

        winner:
          p.user_name !== null || p.full_name !== null
            ? {
                id: p.winner_id,
                username: p.user_name,
                fullName: p.full_name,
              }
            : null,

        _count: {
          bids: p.bid_count,
        },

        images: p.images ?? [],
      }));

      const enrichedData = await Promise.all(
        formattedData.map(enrichProductWithFlags)
      );

      return {
        products: enrichedData,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }

    const where = {
      ...(categoryId && { categoryId }),
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
            select: {
              bids: true,
            },
          },
          images: {
            omit: { productId: true },
          },
        },
        omit: { winnerId: true },
      }),
      prisma.product.count({ where }),
    ]);

    const enrichedData = await Promise.all(data.map(enrichProductWithFlags));

    return {
      products: enrichedData,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getEndingSoonProducts: async () => {
    const products = await prisma.product.findMany({
      where: {
        endDate: { gt: new Date() },
      },
      orderBy: { endDate: "asc" },
      take: 5,
      include: {
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
      },
      omit: { winnerId: true },
    });

    return Promise.all(products.map(enrichProductWithFlags));
  },

  getMostBidsProducts: async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        bids: { _count: "desc" },
      },
      take: 5,
      include: {
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
      },
      omit: { winnerId: true },
    });

    return Promise.all(products.map(enrichProductWithFlags));
  },

  getHighestPriceProducts: async () => {
    const products = await prisma.product.findMany({
      orderBy: { currentPrice: "desc" },
      take: 5,
      include: {
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
      },
      omit: { winnerId: true },
    });

    return Promise.all(products.map(enrichProductWithFlags));
  },

  updateProduct: async ({ id, description }) => {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const newDescription = product.description + " " + description;

    return await prisma.product.update({
      where: { id },
      data: { description: newDescription },
    });
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
