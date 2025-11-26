import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import path from "path";
import router from "./app/routes";

const app = express();
// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const cors_option = {
  origin: [
    "http://localhost:3000",
    "https://k10swf0g-3000.inc1.devtunnels.ms",
    "https://c4c06ffcb03f.ngrok-free.app",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(helmet());
app.use(cors(cors_option));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/status", (req, res) => {
  res.send("Server is ok.");
});

app.use(express.static(path.join(process.cwd(), "uploads")));

// Error handler
app.use(globalErrorHandler);
app.use(notFound);

export default app;
