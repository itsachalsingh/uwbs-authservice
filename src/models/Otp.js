const { Schema, model } = require('mongoose');

const otpSchema = new Schema({
  mobile_number: { type: String, required: true },
  otp: { type: String, required: true },
  expires_at: { type: Date, required: true },
}, { timestamps: true });

otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // auto delete expired OTPs

module.exports = model('Otp', otpSchema);
