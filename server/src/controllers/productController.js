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
      const userId = req.user?.id ?? null;
      const products = await ProductService.getProducts(
        req.validated.query,
        userId
      );
      res.ok("Products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const id = Number(req.validated.params.id);
      const product = await ProductService.getProductById(id);
      res.ok("Product retrieved successfully", product);
    } catch (error) {
      res.error(error.message);
    }
  },

  getRelated: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId } = req.query;

      const products = await ProductService.getRelatedProducts(
        Number(id),
        Number(categoryId)
      );

      res.ok("Related products retrieved successfully", products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getHome: async (req, res) => {
    try {
      const userId = req.user?.id ?? null;
      const products = await ProductService.getHomeProducts(userId);
      res.ok("Home products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  getActiveByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      const products = await ProductService.getActiveProductsByUserId(userId);
      res.ok("Products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  getSoldByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      const products = await ProductService.getSoldProductsByUserId(userId);
      res.ok("Products retrieved successfully", products);
    } catch (error) {
      res.error(error.message);
    }
  },

  getAnalysisByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      const analysis = await ProductService.getProductAnalysisByUserId(userId);
      res.ok("Analysis retrieved successfully", analysis);
    } catch (error) {
      res.error(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.validated.params.id);
      const { description, isAutoExtend, isInstantPurchase } =
        req.validated.body;
      const updatedProduct = await ProductService.updateProduct({
        id,
        description,
        isAutoExtend,
        isInstantPurchase,
      });
      res.ok("Product updated successfully", updatedProduct);
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
