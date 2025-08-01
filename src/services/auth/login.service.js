const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Otp = require("../../models/Otp");
const LoginLog = require("../../models/LoginLog");
const { sanitizeMobileNumber } = require("../../utils/validation");
const { getRoleAndPermissions } = require("../common.service");

exports.loginHandler = async (req, reply) => {
  try {
    const { email_or_mobile_number, password, otp } = req.body;

    let user;
    if (password) {
      user = await User.findOne({
        $or: [
          { email: email_or_mobile_number },
          { mobile_number: email_or_mobile_number },
        ],
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return logFailureAndRespond(req, reply, email_or_mobile_number);
      }
    } else if (otp) {
      const mobile = sanitizeMobileNumber(email_or_mobile_number);
      user = await User.findOne({ mobile_number: mobile });
      if (!user) return logFailureAndRespond(req, reply, email_or_mobile_number);

      const record = await Otp.findOne({ mobile_number: mobile }).sort({ createdAt: -1 });
      if (!record || record.otp !== otp || record.expires_at < new Date()) {
        return logFailureAndRespond(req, reply, email_or_mobile_number);
      }

      await Otp.deleteMany({ mobile_number: mobile });
    } else {
      return logFailureAndRespond(req, reply, email_or_mobile_number);
    }

    const { role, permissions } = await getRoleAndPermissions(user.role_id);

    const token = jwt.sign({ id: user._id, role_id: user.role_id }, process.env.JWT_SECRET);

    await LoginLog.create({
      user_id: user._id,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      login_time: new Date(),
      status: 'success',
      mobile_number: user.mobile_number,
      email: user.email,
    });

    reply.send({
      token,
      message: "Login successful",
      access: { role, permissions },
    });
  } catch (err) {
    await logFailure(req, email_or_mobile_number, err.message);
    reply.code(500).send({ error: "Login failed" });
  }
};

const logFailureAndRespond = async (req, reply, identifier) => {
  await logFailure(req, identifier, "Invalid credentials");
  reply.code(401).send({ error: "Invalid credentials" });
};

const logFailure = async (req, identifier, message) => {
  await LoginLog.create({
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    login_time: new Date(),
    status: 'failed',
    mobile_number: identifier,
    email: identifier,
    error_message: message,
  });
};