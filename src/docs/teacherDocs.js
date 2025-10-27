/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Endpoint khusus teacher
 */

/**
 * @swagger
 * /teacher/dashboard:
 *   get:
 *     summary: Dashboard khusus teacher
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data dashboard teacher
 *       401:
 *         description: Token tidak ditemukan / tidak valid
 *       403:
 *         description: Akses ditolak bukan teacher/admin
 */
