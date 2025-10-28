import nodemailer from "nodemailer";

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
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Debug only in development
    if (process.env.NODE_ENV === "development") {
      console.log("=== SMTP CONFIG ===");
      console.log("SMTP_HOST:", process.env.SMTP_HOST);
      console.log("SMTP_PORT:", process.env.SMTP_PORT);
      console.log("SMTP_USER:", process.env.SMTP_USER);
      console.log("===================");
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
      console.log("Email sent:", info.messageId);
    }

    return info;
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    throw new Error("Gagal mengirim email aktivasi");
  }
};

export default sendEmail;
