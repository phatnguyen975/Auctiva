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

  getAll: async (req, res) => {
    try {
      const categories = await CategoryService.getCategories();
      res.ok(categories);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default CategoryController;
