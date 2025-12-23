export const validateApiKey = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];
  const serverKey = process.env.API_KEY;

  if (!clientKey) {
    return res.error("Missing API key", null, 401);
  }

  if (clientKey !== serverKey) {
    return res.error("Invalid API key", null, 403);
  }

  next();
};
