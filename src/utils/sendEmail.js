import nodemailer from "nodemailer";
import { logger } from "../middlewares/logger.js";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Debug only in development
    if (process.env.NODE_ENV === "development") {
      logger.info("=== SMTP CONFIG ===");
      logger.info("SMTP_HOST:", process.env.SMTP_HOST);
      logger.info("SMTP_PORT:", process.env.SMTP_PORT);
      logger.info("SMTP_USER:", process.env.SMTP_USER);
      logger.info("===================");
    }

    // verify connection configuration
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Worldpedia Education" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    if (process.env.NODE_ENV === "development") {
      logger.info(`"Email terkirim ke ${to}": ${info.messageId}`);
    }

    return info;
  } catch (error) {
    logger.error("Gagal mengirim email:", error);
    throw new Error("Gagal mengirim email aktivasi");
  }
};

export default sendEmail;