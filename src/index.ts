import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import adminController from "./controller/adminController";
import passport from "./config/passportConfig";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use("/admin", adminController);

app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
