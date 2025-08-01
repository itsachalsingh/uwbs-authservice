const {
  sendOtpHandler,
  registerHandler,
  verifyOtpHandler,
  loginHandler,
  logoutHandler,
  forgotPasswordHandler,
  updatePasswordHandler,
  updateProfileHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getAllAdminsHandler,
  getSingleUserHandler,
  getUserProfileHandler
} = require('../services/auth');

exports.sendOtp = sendOtpHandler;
exports.register = registerHandler;
exports.verifyOtp = verifyOtpHandler;
exports.login = loginHandler;
exports.logout = logoutHandler;
exports.forgotPassword = forgotPasswordHandler;
exports.updatePassword = updatePasswordHandler;
exports.updateProfile = updateProfileHandler;
exports.userDelete = deleteUserHandler;
exports.getAllUsers = getAllUsersHandler;
exports.getAllAdmins = getAllAdminsHandler;
exports.getSingleUser = getSingleUserHandler;
exports.getUserProfile = getUserProfileHandler;
