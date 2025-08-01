const Role = require("../models/Role");
const RolePermission = require("../models/RolePermission");

exports.getRoleAndPermissions = async (role_id) => {
  const role = await Role.findById(role_id) || await Role.findOne({ name: 'user' });
  const permissions = await RolePermission.find({ role_id: role._id }).populate("permission_id");
  return {
    role: role.name,
    permissions: permissions.map(p => p.permission_id.name)
  };
};
