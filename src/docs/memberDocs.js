/**
 * @swagger
 * tags:
 *   name: Member
 *   description: Endpoint khusus member
 */

/**
 * @swagger
 * /member/dashboard:
 *   get:
 *     summary: Dashboard khusus member
 *     tags: [Member]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data dashboard member
 *       401:
 *         description: Token tidak ditemukan / tidak valid
 *       403:
 *         description: Akses ditolak bukan member/admin
 */
