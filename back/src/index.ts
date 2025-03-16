import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import adminController from "./controller/adminController";
import employeeController from "./controller/employeeController";
import packetController from "./controller/packetController";
import tokenController from "./controller/tokenController";
import passport from "./config/passportConfig";
dotenv.config();

const app: Application = express();

app.use(express.json());

// CORS 설정
const corsOptions = {
  origin: ["http://localhost:3000", "https://your-production-domain.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use(passport.initialize());

app.use("/admin", adminController);
app.use("/employee", employeeController);
app.use("/packet", packetController);
app.use("/token", tokenController);
app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
