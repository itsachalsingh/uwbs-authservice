const LoginLog = require("../../models/LoginLog");

exports.logoutHandler = async (req, reply) => {
  const userId = req.user.id;
  const now = new Date();
  await LoginLog.findOneAndUpdate(
    { user_id: userId, logout_time: null },
    { logout_time: now, session_duration: 0 },
    { new: true }
  );

  req.user = null;
  req.token = null;
  reply.clearCookie("token");

  reply.send({ message: "Logout successful." });
};