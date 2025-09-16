import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
import { errorHandler } from "./middlewares/errorHandler.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";

// Routes (نضيفهم تدريجياً)
import authRoutes from "./module/auth/router.js";
import albumsRoutes from "./module/albums/router.js";
import mediaRoutes from "./module/media/router.js";
import reviewsRoutes from "./module/reviews/router.js";
import inquiriesRoutes from "./module/inquiries/router.js";
import settingsRoutes from "./module/settings/router.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate limiting
app.use(rateLimiter);

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Sandy Macrame API is running! 🌟",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api/*",
    },
  });
});

// API Routes (معلقة حتى ننشئ الملفات)
app.use("/api/auth", authRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/settings", settingsRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
