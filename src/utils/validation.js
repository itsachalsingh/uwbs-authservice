/**
 * Validation utilities for the auth service
 */

/**
 * Validate mobile number format
 * @param {string} mobileNumber - The mobile number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidMobileNumber = (mobileNumber) => {
  if (!mobileNumber || typeof mobileNumber !== 'string') {
    return false;
  }
  
  // Remove any spaces, dashes, or other separators
  const cleanNumber = mobileNumber.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's 10-15 digits
  return /^\d{10,15}$/.test(cleanNumber);
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate OTP format (6-digit numeric)
 * @param {string} otp - The OTP to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidOTP = (otp) => {
  if (!otp || typeof otp !== 'string') {
    return false;
  }
  
  return /^\d{6}$/.test(otp);
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize mobile number by removing separators
 * @param {string} mobileNumber - The mobile number to sanitize
 * @returns {string} - Clean mobile number
 */
const sanitizeMobileNumber = (mobileNumber) => {
  if (!mobileNumber || typeof mobileNumber !== 'string') {
    return '';
  }
  
  return mobileNumber.replace(/[\s\-\(\)]/g, '');
};

module.exports = {
  isValidMobileNumber,
  isValidEmail,
  isValidOTP,
  validatePassword,
  sanitizeMobileNumber
}; 