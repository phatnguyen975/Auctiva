import ProductService from "../services/productService.js";

import { sendEmail, EmailTemplates } from "../configs/nodemailer.js";

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
      const userId = req.user?.id ?? null;
      const product = await ProductService.getProductById(id, userId);
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

  getWonByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      const products = await ProductService.getWonProductsByUserId(userId);
      res.ok("Won products retrieved successfully", products);
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

  createBuyNow: async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const userId = req.user.id;
      const { updatedProduct, transaction, emails } =
        await ProductService.buyNow(productId, userId);

      Promise.all([
        // Gửi mail cho Bidder mà vừa Buy Now
        sendEmail({
          to: emails.bidder.to,
          subject: `[Auctiva] Congratulations! You have successfully purchased ${emails.productName}`,
          html: EmailTemplates.buyNowConfirmation({
            bidderName: emails.bidder.name,
            productName: emails.productName,
            price: emails.price,
            transactionLink: `${process.env.CLIENT_URL}/dashboard/bidder/transactions/${transaction.id}`,
          }),
        }),
        // Gửi mail cho Seller thông báo sản phẩm đã có người mua ngay
        sendEmail({
          to: emails.seller.to,
          subject: `[Auctiva] Your product ${emails.productName} has been sold instantly!`,
          html: EmailTemplates.productSoldBuyNow({
            sellerName: emails.seller.name,
            bidderName: emails.bidder.name,
            productName: emails.productName,
            price: emails.price,
            transactionLink: `${process.env.CLIENT_URL}/dashboard/seller/transactions/${transaction.id}`,
          }),
        }),

        // Gửi mail cho những người bid sản phẩm này thông báo sản phẩm đã bị mua ngay
        emails.others.forEach((person) => {
          sendEmail({
            to: person.to,
            subject: `[Auctiva] Thông báo kết thúc đấu giá: ${emails.productName}`,
            html: EmailTemplates.auctionClosedOtherBidders({
              productName: emails.productName,
              finalPrice: emails.price,
              homeLink: process.env.CLIENT_URL,
            }),
          }).catch((err) =>
            console.error(`Lỗi gửi mail đến bidder ${person.to}:`, err.message)
          );
        }),
      ]);

      res.ok("Buy product successfully!", {
        updatedProduct,
        transaction,
        emails,
      });
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
