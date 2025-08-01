const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  nid: { type: Number }, // Optional external system ID
  role_id: { type: Types.ObjectId, ref: 'Role', required: true },
  first_name: { type: String, maxlength: 255 },
  last_name: { type: String, maxlength: 255 },
  mobile_number: { type: String, unique: true, maxlength: 20 },
  email: { type: String, required: true, unique: true, maxlength: 255 },
  password: { type: String, required: true, maxlength: 255 },
  is_email_verified: { type: Boolean, default: false },
  is_mobile_number_verified: { type: Boolean, default: false },
  is_account_approved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'block', 'inactive'],
    default: 'inactive'
  },
  department_type: {
    type: String,
    enum: ['user', 'ujs', 'ujn', 'superadmin'],
    default: 'user'
  },
  consumerCode: { type: String, default: null, maxlength: 50 }, // Unique consumer code
  is_migrated: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = model('User', userSchema);
