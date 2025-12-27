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
        postDate: product.postDate,
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
          url: true,
          isPrimary: true,
        },
      },
    });

    return newProduct;
  },
};

export default ProductService;
