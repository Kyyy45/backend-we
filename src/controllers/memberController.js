export const getMemberDashboard = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: `Welcome Member ${req.user.name}`,
      member: req.user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
