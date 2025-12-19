import CategoryService from "../services/categoryService.js";

const CategoryController = {
  create: async (req, res) => {
    try {
      const newCategory = await CategoryService.createCategory(
        req.validated.body
      );
      res.created("Category created successfully", newCategory);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default CategoryController;
