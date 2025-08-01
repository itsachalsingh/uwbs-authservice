const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { sanitizeMobileNumber } = require("../../utils/validation");

exports.forgotPasswordHandler = async (req, reply) => {
  const { email_or_mobile_number, password, confirm_password } = req.body;

  if (!email_or_mobile_number || !password || !confirm_password) {
    return reply.code(400).send({ error: "All fields are required" });
  }

  if (password !== confirm_password) {
    return reply.code(400).send({ error: "Passwords do not match" });
  }

  try {
    const cleanMobile = sanitizeMobileNumber(email_or_mobile_number);
    const user = await User.findOne({
      $or: [
        { email: email_or_mobile_number },
        { mobile_number: cleanMobile },
      ]
    });
    if (!user) return reply.code(404).send({ error: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    reply.send({ message: "Password updated successfully" });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

exports.updatePasswordHandler = async (req, reply) => {
  const { old_password, new_password } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!user) return reply.code(404).send({ error: "User not found" });

  const match = await bcrypt.compare(old_password, user.password);
  if (!match) return reply.code(400).send({ error: "Old password incorrect" });

  user.password = await bcrypt.hash(new_password, 10);
  await user.save();
  reply.send({ message: "Password updated successfully" });
};