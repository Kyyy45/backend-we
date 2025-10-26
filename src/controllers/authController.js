import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validations/authValidation.js";
import sendActivationEmail from "../utils/sendEmail.js";

// Helper untuk buat token
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Access token singkat
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // Refresh token lebih lama
  });

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;

    // Validasi
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    // Username/email unik
    if (await User.findOne({ username })) return res.status(400).json({ errors: ["Username sudah digunakan"] });
    if (await User.findOne({ email })) return res.status(400).json({ errors: ["Email sudah terdaftar"] });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName, username, email, password: hashedPassword, role: "member", isActive: false
    });

    // Token aktivasi akun
    const activationToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const activationLink = `${process.env.CLIENT_URL}/activation?code=${activationToken}`;
    await sendActivationEmail(email, fullName, activationLink);

    return res.status(201).json({ message: "Registrasi berhasil. Silakan cek email untuk aktivasi akun!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
};

// ACTIVATE
export const activateAccount = async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ errors: ["Token aktivasi tidak ditemukan"] });

  try {
    const decoded = jwt.verify(code, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ errors: ["User tidak ditemukan"] });
    if (user.isActive) return res.status(400).json({ errors: ["Akun sudah aktif"] });

    user.isActive = true;
    await user.save();
    return res.status(200).json({ message: "Aktivasi akun berhasil!" });
  } catch (error) {
    console.error("Activation Error:", error.message);
    return res.status(400).json({ errors: ["Token tidak valid atau sudah kadaluarsa"] });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) return res.status(400).json({ errors: ["Akun tidak ditemukan"] });
    if (!user.isActive) return res.status(403).json({ errors: ["Akun belum diaktivasi"] });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ errors: ["Password salah"] });

    // Buat token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Kirim refresh token di httpOnly cookie
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
    if (!token) return res.status(401).json({ errors: ["Refresh token tidak ditemukan"] });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ errors: ["User tidak ditemukan"] });

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(403).json({ errors: ["Refresh token tidak valid atau kadaluarsa"] });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logout berhasil" });
};