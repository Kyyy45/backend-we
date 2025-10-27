import User from "../models/userModel.js";

// Ambil semua user
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// Delete user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }
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
