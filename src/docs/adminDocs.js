/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoint khusus Admin (manage user, ubah role, delete user)
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil seluruh user
 *       403:
 *         description: Akses ditolak (bukan admin)
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user yang akan dihapus
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *       404:
 *         description: User tidak ditemukan
 */

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update role user (admin → teacher/member)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, teacher, member]
 *             example:
 *               role: "teacher"
 *     responses:
 *       200:
 *         description: Role berhasil diperbarui
 *       400:
 *         description: Role tidak valid
 */
