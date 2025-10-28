import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const testSMTPConnection = async () => {
  console.log("\n🧪 Testing SMTP Connection...\n");
  
  // Check environment variables
  console.log("📋 Checking environment variables:");
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || '❌ NOT SET'}`);
  console.log(`   SMTP_PORT: ${process.env.SMTP_PORT || '❌ NOT SET'}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER || '❌ NOT SET'}`);
  console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? '✅ SET (' + process.env.SMTP_PASS.length + ' chars)' : '❌ NOT SET'}\n`);

  // Validate
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("❌ Missing SMTP configuration in .env file!");
    console.log("\nExample .env configuration:");
    console.log(`
# For Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password

# For Mailtrap:
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
    `);
    process.exit(1);
  }

  try {
    // Create transporter
    console.log("🔧 Creating transporter...");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ Connection verified successfully!\n");

    // Send test email
    console.log("📧 Sending test email...");
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to own email
      subject: "✅ Test Email from Node.js Backend",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0;">
          <h1 style="color: #4CAF50;">✅ Success!</h1>
          <p>Your SMTP configuration is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Message ID:</strong> ${Date.now()}</p>
          <p>You can now register users and they will receive activation emails.</p>
        </div>
      `,
    });

    console.log(`✅ Email sent successfully!`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}\n`);

    console.log("🎉 All tests passed! Your email configuration is ready.\n");
    console.log("📝 Next steps:");
    console.log("   1. Check your email inbox for the test email");
    console.log("   2. Try registering a user in your application");
    console.log("   3. Verify the activation email arrives\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\n📝 Troubleshooting:");
    console.error("   1. Check if SMTP credentials are correct");
    console.error("   2. If using Gmail: enable 2FA and use App Password");
    console.error("      → Go to: https://myaccount.google.com/apppasswords");
    console.error("   3. If using Mailtrap: verify credentials from dashboard");
    console.error("      → Go to: https://mailtrap.io");
    console.error("   4. Check firewall/network settings");
    console.error("   5. Make sure .env file is in root directory\n");
    console.error("Full error:", error);
    process.exit(1);
  }
};

testSMTPConnection();