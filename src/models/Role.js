const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
  name: { type: String, required: true, maxlength: 255 }
}, {
  timestamps: true
});

module.exports = model('Role', roleSchema);
