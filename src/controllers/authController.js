import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import { getActivationEmailHTML, getResetPasswordEmailHTML, } from "../utils/emailTemplates.js";
import { registerSchema,forgotPasswordSchema, resetPasswordSchema } from "../validations/authValidation.js";

/**
 * Helper token generators
 */
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;

    // Validate request
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ errors });
    }

    // Uniqueness check
    // 1. Jalankan kedua pencarian secara paralel
    const [usernameCheck, emailCheck] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    const errors = [];

    // 2. Tentukan pesan error berdasarkan hasil pencarian
    if (usernameCheck && emailCheck) {
      // Keduanya ada, kirim satu pesan gabungan
      errors.push("Username dan Email sudah digunakan");
    } else if (usernameCheck) {
      // Hanya username yang ada
      errors.push("Username sudah digunakan");
    } else if (emailCheck) {
      // Hanya email yang ada
      errors.push("Email sudah terdaftar");
    }

    // 3. Kirim response jika ada error
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      role: "member",
      isActive: false,
    });

    // Generate activation token (JWT)
    const activationToken = jwt.sign(
      { id: newUser._id },
      process.env.ACTIVATION_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Activation link (frontend handles posting token to backend)
    const activationLink = `${process.env.CLIENT_URL}/activation?code=${activationToken}`;
    const emailHtml = getActivationEmailHTML(newUser.fullName, activationLink);

    // Send activation email
    await sendEmail(
      newUser.email,
      "Aktivasi Akun Worldpedia Education",
      emailHtml
    );

    return res.status(201).json({
      message: "Registrasi berhasil. Silakan cek email untuk aktivasi akun!",
    });
  } catch (error) {
    console.error(error);
    // Jika error datang dari sendEmail, kita tangkap di sini
    if (error.message === "Gagal mengirim email aktivasi") {
      return res.status(500).json({
        errors: ["Registrasi berhasil, namun gagal mengirim email aktivasi."],
      });
    }
    return res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
};

// ACTIVATE ACCOUNT
export const activateAccount = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code)
      return res
        .status(400)
        .json({ errors: ["Token aktivasi tidak ditemukan"] });
        
    // Token verification
    const decoded = jwt.verify(code, process.env.ACTIVATION_TOKEN_SECRET);

    // Search for users by ID
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(400).json({ errors: ["User tidak ditemukan"] });
    if (user.isActive)
      return res.status(400).json({ errors: ["Akun sudah aktif"] });

    // Active status update
    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: "Aktivasi akun berhasil!" });
  } catch (error) {
    console.error("Activation Error:", error.message);
    return res
      .status(400)
      .json({ errors: ["Token tidak valid atau sudah kadaluarsa"] });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user)
      return res.status(400).json({ errors: ["Akun tidak ditemukan"] });
    if (!user.isActive)
      return res.status(403).json({ errors: ["Akun belum diaktivasi"] });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ errors: ["Password salah"] });

    // Create a token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login berhasil", accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ errors: ["Refresh token tidak ditemukan"] });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ errors: ["User tidak ditemukan"] });

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ errors: ["Refresh token tidak valid atau kadaluarsa"] });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
};

// RESEND ACTIVATION
export const resendActivation = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: [error.details[0].message] });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errors: ["Email tidak ditemukan"] });
    }
    if (user.isActive) {
      return res.status(400).json({ errors: ["Akun sudah aktif"] });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACTIVATION_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    const activationLink = `${process.env.CLIENT_URL}/activation?code=${token}`;
    const emailHtml = getActivationEmailHTML(user.fullName, activationLink);

    await sendEmail(
      user.email,
      "Aktivasi Akun Worldpedia Education",
      emailHtml
    );

    return res
      .status(200)
      .json({ message: "Email aktivasi telah dikirim ulang!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    // 1. Validasi email
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: [error.details[0].message] });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    // 2. Selalu kirim respons sukses untuk mencegah user enumeration
    if (!user) {
      return res
        .status(200)
        .json({ message: "Jika email terdaftar, link reset akan dikirim." });
    }
    
    // 3. Buat secret unik (hash trick)
    const resetSecret = process.env.RESET_PASSWORD_SECRET + "-" + user.password;

    // 4. Buat token reset (15 menit)
    const resetToken = jwt.sign(
      { id: user._id }, 
      resetSecret, 
      { expiresIn: "15m" }
    );

    // 5. Buat link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // 6. Gunakan template email reset
    const emailHtml = getResetPasswordEmailHTML(user.fullName, resetLink);

    await sendEmail(
      user.email,
      "Reset Password Worldpedia Education",
      emailHtml
    );

    return res
      .status(200)
      .json({ message: "Jika email terdaftar, link reset akan dikirim." });
      
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    // 1. Validasi token, password baru, dan konfirmasi password baru
    const { error } = resetPasswordSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ errors });
    }

    // Ambil data setelah divalidasi
    // Kita tidak butuh confirmNewPassword di sini, Joi sudah menanganinya
    const { token, newPassword } = req.body; 

    // 2. Dekode token untuk dapatkan ID
    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(400).json({ errors: ["Token tidak valid"] });
    }

    // 3. Cari user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ errors: ["User tidak ditemukan"] });
    }

    // 4. Buat ulang secret (hash trick)
    const resetSecret = process.env.RESET_PASSWORD_SECRET + "-" + user.password;

    // 5. Verifikasi token DENGAN secret yang baru dibuat
    try {
      jwt.verify(token, resetSecret);
    } catch (verifyError) {
      return res
        .status(400)
        .json({ errors: ["Token tidak valid atau sudah kadaluarsa"] });
    }
    
    // 6. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7. Update password user
    user.password = hashedPassword;
    await user.save();
    
    return res.status(200).json({ message: "Password berhasil diubah. Silakan login." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
};