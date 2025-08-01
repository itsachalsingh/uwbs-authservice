const { Schema, model, Types } = require('mongoose');

const rolePermissionSchema = new Schema({
  role_id: { type: Types.ObjectId, ref: 'Role', required: true },
  permission_id: { type: Types.ObjectId, ref: 'Permission', required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = model('RolePermission', rolePermissionSchema);
