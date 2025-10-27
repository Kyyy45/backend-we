/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk autentikasi dan otorisasi user
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             example:
 *               fullName: "Number One"
 *               username: "one"
 *               email: "number777@yopmail.com"
 *               password: "One1234!"
 *               confirmPassword: "One1234!"
 *     responses:
 *       201:
 *         description: Registrasi berhasil, silakan cek email untuk aktivasi.
 *       400:
 *         description: Validasi gagal atau email/username sudah ada.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "number777@yopmail.com"
 *               password: "One1234!"
 *     responses:
 *       200:
 *         description: Login berhasil, token disimpan di cookie.
 *       400:
 *         description: Email atau password salah.
 */

/**
 * @swagger
 * /auth/resend-activation:
 *   post:
 *     summary: Kirim ulang email aktivasi akun
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             example:
 *               email: "number777@yopmail.com"
 *     responses:
 *       200:
 *         description: Email aktivasi telah dikirim ulang.
 *       404:
 *         description: Email tidak ditemukan.
 *       400:
 *         description: Akun sudah aktif.
 */

/**
 * @swagger
 * /auth/activation:
 *   post:
 *     summary: Aktivasi akun dengan token dari email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Akun berhasil diaktifkan.
 *       400:
 *         description: Token tidak valid atau kadaluarsa.
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Generate token baru dari refresh token (via cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token baru berhasil dibuat.
 *       403:
 *         description: Refresh token tidak ada atau tidak valid.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (hapus cookie token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil.
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Minta reset password melalui email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Link reset password telah dikirim ke email.
 *       404:
 *         description: Email tidak ditemukan.
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password menggunakan token dari email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - confirmPassword
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword: "NewPass123!"
 *               confirmPassword: "NewPass123!"
 *     responses:
 *       200:
 *         description: Password berhasil direset.
 *       400:
 *         description: Token tidak valid, kadaluarsa, atau password tidak cocok.
 */