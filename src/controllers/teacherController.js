export const getTeacherDashboard = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: `Welcome Teacher ${req.user.name}`,
      teacher: req.user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};