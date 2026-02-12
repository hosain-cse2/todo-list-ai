import "dotenv/config";
import express from "express";
import config from "./src/config";
import routes from "./src/routes";
import { errorHandler } from "./src/middleware/error.middleware";

const app = express();

app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
