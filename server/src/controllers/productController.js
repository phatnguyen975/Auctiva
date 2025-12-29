import ProductService from "../services/productService.js";

const ProductController = {
  create: async (req, res) => {
    try {
      const newProduct = await ProductService.createProduct({
        userId: req.user.id,
        product: req.validated.body,
      });
      res.created("Product created successfully", newProduct);
    } catch (error) {
      res.error(error.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const products = await ProductService.getProducts(req.validated.query);
      res.ok("Products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  getEndingSoon: async (req, res) => {
    try {
      const products = await ProductService.getEndingSoonProducts();
      res.ok("Products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  getMostBids: async (req, res) => {
    try {
      const products = await ProductService.getMostBidsProducts();
      res.ok("Products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  getHighestPrice: async (req, res) => {
    try {
      const products = await ProductService.getHighestPriceProducts();
      res.ok("Products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.validated.params.id);
      await ProductService.deleteProduct(id);
      res.ok("Product deleted successfully", null);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default ProductController;
