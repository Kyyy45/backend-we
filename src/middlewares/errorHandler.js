import { logger } from "./logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(`${req.method} ${req.url} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Terjadi kesalahan di server"
        : err.message,
  });
};

export default errorHandler;