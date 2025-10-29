import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Nama lengkap tidak boleh kosong",
    "string.min": "Nama lengkap minimal 3 karakter",
    "string.max": "Nama lengkap maksimal 100 karakter",
  }),
  username: Joi.string().alphanum().min(5).max(30).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.alphanum": "Username hanya boleh mengandung huruf dan angka",
    "string.min": "Username minimal 5 karakter",
    "string.max": "Username maksimal 30 karakter",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
  }),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$")
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, dan simbol.",
      "string.empty": "Password tidak boleh kosong",
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Password dan Konfirmasi Password tidak sama",
    "string.empty": "Konfirmasi password harus diisi",
  }),
}).options({ abortEarly: false });

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token tidak boleh kosong",
    "any.required": "Token wajib diisi",
  }),

  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .required()
    .messages({
      "string.empty": "Password baru harus diisi",
      "string.min": "Password baru minimal 8 karakter",
      "string.pattern.base":
        "Password baru harus mengandung minimal 1 huruf besar, 1 angka, dan 1 simbol",
    }),

  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "Password baru dan Konfirmasi Password tidak sama",
      "string.empty": "Konfirmasi password baru harus diisi",
    }),
}).options({ abortEarly: false });