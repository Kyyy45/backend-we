import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "string.empty": "Nama lengkap harus diisi",
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username harus diisi",
    "string.alphanum": "Username hanya boleh mengandung huruf dan angka",
    "string.min": "Username minimal 3 karakter",
    "string.max": "Username maksimal 30 karakter",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
  }),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .required()
    .messages({
      "string.empty": "Password harus diisi",
      "string.min": "Password minimal 8 karakter",
      "string.pattern.base":
        "Password harus mengandung minimal 1 huruf besar, 1 angka, dan 1 simbol",
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Password dan Konfirmasi Password tidak sama",
    "string.empty": "Konfirmasi password harus diisi",
  }),
}).options({ abortEarly: false });