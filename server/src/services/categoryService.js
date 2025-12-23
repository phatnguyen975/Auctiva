import { prisma } from "../configs/prisma.js";
import { createSlug } from "../utils/slugUtil.js";

const CategoryService = {
  createCategory: async (category) => {
    if (category.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: category.parentId },
      });

      if (!parentCategory) {
        throw new Error("Parent category not found");
      }
    }

    if (!category.slug) {
      const baseSlug = createSlug(category.name);
      let slug = baseSlug;
      let count = 1;

      while (await prisma.category.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count++}`;
      }

      category.slug = slug;
    }

    const newCategory = await prisma.category.create({
      data: category,
    });

    return newCategory;
  },

  getCategories: async () => {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          omit: {
            createdAt: true,
          },
        },
      },
      omit: {
        createdAt: true,
      },
    });

    return categories;
  },
};

export default CategoryService;
