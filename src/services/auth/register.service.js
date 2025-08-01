const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Role = require("../../models/Role");
const { sanitizeMobileNumber, isValidMobileNumber, validatePassword } = require("../../utils/validation");

exports.registerHandler = async (req, reply) => {
  try {
    const { first_name, last_name, email, password, mobile_number, otp } = req.body;

    if (!first_name || !last_name || !email || !password || !mobile_number || !otp) {
      return reply.code(400).send({ error: "All fields are required." });
    }

    const cleanMobile = sanitizeMobileNumber(mobile_number);
    if (!isValidMobileNumber(cleanMobile)) {
      return reply.code(400).send({ error: "Invalid mobile number." });
    }

    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      return reply.code(400).send({ error: errors.join(", ") });
    }

    const exists = await User.findOne({ $or: [{ email }, { mobile_number: cleanMobile }] });
    if (exists) return reply.code(400).send({ error: "User already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const role = await Role.findOne({ name: "user" });
    const consumerCode = `uwbs-${cleanMobile}-${Date.now().toString().slice(-6)}`;

    const user = await User.create({
      first_name, last_name, email,
      password: hashed,
      mobile_number: cleanMobile,
      role_id: role._id,
      is_mobile_number_verified: true,
      consumerCode,
      is_account_approved: true,
      status: "active",
    });

    reply.code(201).send({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      mobile_number: user.mobile_number,
      role_id: user.role_id,
      message: "User registered successfully."
    });
  } catch (err) {
    console.error("Registration error:", err);
    reply.code(500).send({ error: "Registration failed." });
  }
};