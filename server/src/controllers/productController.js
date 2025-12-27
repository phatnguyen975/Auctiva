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
};

export default ProductController;
