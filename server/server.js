import "dotenv/config";
import { httpServer } from "./src/sockets/index.js";

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
