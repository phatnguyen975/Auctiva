import { prisma } from "../configs/prisma.js";
import { createSlug } from "../utils/slugUtil.js";
import sanitizeHtml from "sanitize-html";

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
          omit: {
            productId: true,
          },
        },
      },
    });

    return newProduct;
  },

  getProducts: async ({ page, limit, categoryId, sortBy, order, keyword }) => {
    const skip = (page - 1) * limit;

    if (keyword) {
      let orderBy = "ORDER BY p.created_at DESC";
      if (sortBy && order) {
        if (sortBy === "endDate") {
          orderBy = `ORDER BY p.end_date ${order.toUpperCase()}`;
        }
        if (sortBy === "currentPrice") {
          orderBy = `ORDER BY p.current_price ${order.toUpperCase()}`;
        }
      }

      const data = await prisma.$queryRawUnsafe(
        `
          SELECT
            p.*,
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
          LEFT JOIN product_images i ON i.product_id = p.id
          WHERE
            (${categoryId ? "p.category_id = $1" : "1 = 1"})
            AND (
              p.search_vector @@ plainto_tsquery('english', $2)
              OR c.search_vector @@ plainto_tsquery('english', $2)
              OR p.name ILIKE '%' || $2 || '%'
              OR c.name ILIKE '%' || $2 || '%'
            )
          GROUP BY p.id
          ${orderBy}
          LIMIT $3
          OFFSET $4
        `,
        categoryId,
        keyword,
        limit,
        skip
      );

      const total = await prisma.$queryRawUnsafe(
        `
          SELECT COUNT(DISTINCT p.id)::int
          FROM products p
          JOIN categories c ON c.id = p.category_id
          WHERE
            (${categoryId ? "p.category_id = $1" : "1 = 1"})
            AND (
              p.search_vector @@ plainto_tsquery('english', $2)
              OR c.search_vector @@ plainto_tsquery('english', $2)
              OR p.name ILIKE '%' || $2 || '%'
              OR c.name ILIKE '%' || $2 || '%'
            )
        `,
        categoryId,
        keyword
      );

      const totalCount = Number(total[0].count);

      return {
        products: data,
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
          images: {
            omit: {
              productId: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: data,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

export default ProductService;
