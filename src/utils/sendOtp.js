const axios = require("axios");
const https = require("https");
require("dotenv").config();

const containsNonLatinCodepoints = (str) => /[^\u0000-\u00ff]/.test(str);

/**
 * Send SMS using HMI Media API
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient(s)
 * @param {string} options.templateId - SMS template ID
 * @param {string} options.message - SMS message
 * @param {string} [options.type] - Optional message type (TEXT | UNICODE)
 */
const sendSMS = async ({ phone, otp }) => {
  try {
    const sender = "UKITDA";
    const username = process.env.HMIMEDIA_SMS_API_USERNAME;
    const password = process.env.HMIMEDIA_SMS_API_PASSWORD;
    const eid = process.env.HMIMEDIA_SMS_API_ENTITY_ID;
    const templateId = process.env.HMIMEDIA_SMS_TEMPLATE_ID;
  
    const _to = Array.isArray(phone) ? phone.join(",") : phone.toString();
    const message = encodeURIComponent(`UKUCC- ${otp} is your one time password (OTP) for mobile number verification.`);
    const apiUrl = `https://itda.hmimedia.in/pushsms.php?username=${username}&api_password=${password}&sender=${sender}&to=${_to}&message=${message}&priority=11&e_id=${eid}&t_id=${templateId}`;
  
    console.log("Final URL:", apiUrl);
  
    const agent = new https.Agent({ rejectUnauthorized: false });
  
    const { data } = await axios.get(apiUrl, { httpsAgent: agent });
  
    console.log("dataaaa", data);
    return data;
  } catch (error) {
    console.error("SMS sending failed:", error);
    throw new Error("Failed to send SMS");
  }
};

function generateNumericOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

module.exports = { sendSMS, generateNumericOTP };
