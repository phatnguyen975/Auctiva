import SellerUpgradeService from "../services/sellerUpgradeService.js";

const SellerUpgradeController = {
  create: async (req, res) => {
    try {
      const newSellerUpgrade = await SellerUpgradeService.createSellerUpgrade(
        req.validated.body
      );
      res.created("Seller upgrade created successfully", newSellerUpgrade);
    } catch (error) {
      res.error(error.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const sellerUpgrade = await SellerUpgradeService.getSellerUpgrade();
      res.ok("Seller upgrade retrieved successfully", sellerUpgrade);
    } catch (error) {
      res.error(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const id = req.validated.params.id;
      const data = req.validated.body;
      const updatedSellerUpgrade =
        await SellerUpgradeService.updateSellerUpgrade(id, data);
      res.ok("Seller upgrade updated successfully", updatedSellerUpgrade);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default SellerUpgradeController;
