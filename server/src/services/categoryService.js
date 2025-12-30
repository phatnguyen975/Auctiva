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

    if (category.slug === undefined || category.slug === null) {
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
    return await prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
    });
  },

  deleteCategory: async (id) => {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new Error(
        `Category ${id} is being used in ${productCount} product(s)`
      );
    }

    const categoryCount = await prisma.category.count({
      where: { parentId: id },
    });

    if (categoryCount > 0) {
      throw new Error(
        `Category ${id} is being used in ${categoryCount} category(s)`
      );
    }

    await prisma.category.delete({
      where: { id },
    });
  },
};

export default CategoryService;
