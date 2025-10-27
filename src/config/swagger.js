// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WE-Project API Documentation",
      version: "1.0.0",
      description:
        "Dokumentasi API untuk sistem autentikasi dan manajemen user (MERN Stack)",
      contact: { name: "Developer", email: "developer@example.com" },
    },
    servers: [{ url: "http://localhost:5000/api" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // Semua file Docs akan diproses
  apis: [
    path.join(__dirname, "../docs/*.js"),
    path.join(__dirname, "../routes/*.js"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi;