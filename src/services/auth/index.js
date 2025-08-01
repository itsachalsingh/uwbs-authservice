const { sendOtpHandler, verifyOtpHandler } = require('./otp.service');
const { registerHandler } = require('./register.service');
const { loginHandler } = require('./login.service');
const { logoutHandler } = require('./logout.service');
const {
  forgotPasswordHandler,
  updatePasswordHandler
} = require('./password.service');
const {
  updateProfileHandler,
  getUserProfileHandler,
  getSingleUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getAllAdminsHandler
} = require('./profile.service');

module.exports = {
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
};
