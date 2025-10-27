/**
 * @swagger
 * tags:
 *   name: Protected
 *   description: Routes yang membutuhkan autentikasi JWT
 */

/**
 * @swagger
 * /protected/profile:
 *   get:
 *     summary: Ambil data profil user saat ini
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       401:
 *         description: Token tidak valid atau tidak ditemukan
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */

/**
 * @swagger
 * /protected/admin-data:
 *   get:
 *     summary: Data khusus admin
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data admin berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       401:
 *         description: Token tidak valid atau tidak ditemukan
 *       403:
 *         description: Akses ditolak (hanya admin)
 */
