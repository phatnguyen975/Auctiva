import QAService from "../services/qaService.js";

const QAController = {
  getProductQA: async (req, res) => {
    try {
      const data = await QAService.getQAByProduct(req.params.productID);
      res.json(data);
    } catch (error) {
      console.log("Error in getProductQA:", error.message);
      res.status(400).json({ message: error.message });
    }
  },

  ask: async (req, res) => {
    try {
      const { productId, question } = req.body;
      const data = await QAService.createQuestion(
        productId,
        req.user.id,
        question
      );
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  reply: async (req, res) => {
    try {
      const { questionId, answer } = req.body;
      const data = await QAService.createAnswer(
        questionId,
        req.user.id,
        answer
      );
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default QAController;
