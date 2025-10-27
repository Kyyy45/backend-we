import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { swaggerSpec, swaggerUiServe, swaggerUiSetup } from "./src/config/swagger.js";
import authRoutes from "./src/routes/authRoutes.js";
import protectedRoutes from "./src/routes/protectedRoutes.js";

const app = express();
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUiServe, swaggerUiSetup(swaggerSpec));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

// Basic root route
app.get("/", (req, res) => res.json({ message: "API is running" }));

export default app;