import nodemailer from "nodemailer";

// Fungsi kirim email aktivasi
const sendActivationEmail = async (toEmail, fullName, activationLink) => {
  try {
    // Debug: tampilkan config SMTP
    console.log("=== SMTP CONFIG ===");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("==================");

    // Buat transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Cek koneksi SMTP
    await transporter.verify();
    console.log("SMTP connection OK ✅");

    // Email options
    const mailOptions = {
      from: `"Worldpedia Education" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Aktivasi Akun Worldpedia Education",
      html: `
        <p>Halo <strong>${fullName}</strong>,</p>
        <p>Terima kasih telah mendaftar. Klik link berikut untuk mengaktifkan akun Anda:</p>
        <a href="${activationLink}">${activationLink}</a>
        <p>Link akan kadaluarsa dalam 24 jam.</p>
      `,
    };

    // Kirim email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email terkirim:", info.messageId);
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    throw new Error("Gagal mengirim email aktivasi");
  }
};

export default sendActivationEmail;
