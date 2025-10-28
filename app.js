import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import {
  swaggerSpec,
  swaggerUiMiddleware,
} from "./src/config/swagger.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import memberRoutes from "./src/routes/memberRoutes.js";
import teacherRoutes from "./src/routes/teacherRoutes.js";

const app = express();
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/teacher", teacherRoutes);

// Basic root route
app.get("/", (req, res) => res.json({ message: "API is running" }));

export default app;