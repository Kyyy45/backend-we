import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Format log
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

// Winston instance
export const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Stream untuk morgan (jika ingin pakai HTTP request logger)
export const stream = {
  write: (message) => logger.info(message.trim()),
};