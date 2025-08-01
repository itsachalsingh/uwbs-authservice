const { Schema, model } = require('mongoose');

const permissionSchema = new Schema({
  name: { type: String, required: true, maxlength: 255 }
}, {
  timestamps: true
});

module.exports = model('Permission', permissionSchema);
