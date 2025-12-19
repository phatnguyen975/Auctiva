import { prisma } from "../configs/prisma.js";

const CategoryService = {
  createCategory: async (category) => {
    const newCategory = await prisma.category.create({
      data: category,
    });
    return newCategory;
  },
};

export default CategoryService;
