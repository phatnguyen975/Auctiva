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
      res.ok("Categories retrieved successfully", categories);
    } catch (error) {
      res.error(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.validated.params.id);
      const data = req.validated.body;
      const updatedCategory = await CategoryService.updateCategory(id, data);
      res.ok("Category updated successfully", updatedCategory);
    } catch (error) {
      res.error(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.validated.params.id);
      await CategoryService.deleteCategory(id);
      res.ok("Category deleted successfully", null);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default CategoryController;
