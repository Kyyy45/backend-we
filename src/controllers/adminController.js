import User from "../models/userModel.js";

// Ambil semua user
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)

    const totalUsers = await User.countDocuments();
    
    res.status(200).json({
      data: users,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: Math.ceil(totalUsers / limit),
        totalData: totalUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ errors: ["Tidak bisa menghapus admin terakhir"] });
      }
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

// Update Role User
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["admin", "teacher", "member"].includes(role)) {
      return res.status(400).json({ errors: ["Role tidak valid"] });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    res.json({ message: "Role updated", user });
  } catch (error) {
    next(error);
  }
};
