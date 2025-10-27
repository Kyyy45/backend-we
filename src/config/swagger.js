import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Worldpedia Education API",
      version: "1.0.0",
      description: "API Documentation with Swagger",
    },
    servers: [
      { url: "http://localhost:5000" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/routes/*.js",
    "./src/docs/*.js"
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup;