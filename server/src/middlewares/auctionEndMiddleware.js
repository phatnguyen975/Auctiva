import { prisma } from "../configs/prisma.js";

export const checkAuctionEndTime = async (req, res, next) => {
  const { id } = req.validated.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.error("Product not found", null, 400);
  }

  const now = new Date();
  if (new Date(product.endDate) < now) {
    return res.error("Auction is ended", null, 400);
  }

  next();
};
