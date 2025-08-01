const { sanitizeMobileNumber, isValidMobileNumber } = require('../../utils/validation');
const { generateNumericOTP, sendSMS } = require('../../utils/sendOtp');
const Otp = require('../../models/Otp');
const User = require('../../models/User');

exports.sendOtpHandler = async (req, reply) => {
  try {
    const cleanMobile = sanitizeMobileNumber(req.body.mobile_number);

    if (!isValidMobileNumber(cleanMobile)) {
      return reply.code(400).send({ error: "Invalid mobile number format. Must be 10 digits." });
    }

    const otp = generateNumericOTP(6);
    await Otp.deleteMany({ mobile_number: cleanMobile });

    await Otp.create({
      mobile_number: cleanMobile,
      otp,
      expires_at: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendSMS({ phone: cleanMobile, otp });

    reply.code(200).send({
      message: "OTP sent successfully",
      mobile_number: cleanMobile,
      ...(process.env.NODE_ENV === "development" && { otp })
    });
  } catch (err) {
    console.error("OTP Send Error:", err);
    reply.code(500).send({ error: "Failed to send OTP" });
  }
};

exports.verifyOtpHandler = async (req, reply) => {
  try {
    const { mobile_number, otp } = req.body;

    const record = await Otp.findOne({ mobile_number, otp });
    if (!record || record.expires_at < new Date()) {
      return reply.code(400).send({ error: "Invalid or expired OTP" });
    }

    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOneAndUpdate(
      { mobile_number },
      { is_mobile_number_verified: true, status: "active" },
      { new: true }
    );

    if (!user) return reply.code(404).send({ error: "User not found" });

    reply.send({ message: "OTP verified successfully" });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};
