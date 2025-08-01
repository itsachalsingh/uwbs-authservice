const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');

  exports.createRole = async (req, reply) => {
    try {
      const { name } = req.body;
      const role = await Role.create({ name });
      reply.code(201).send({ id: role._id, name: role.name });
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  };

  exports.getAllRoles = async (req, reply) => {
    try {
      const roles = await Role.find();
      const formattedRoles = roles.map(role => ({
        id: role._id,
        name: role.name
      }));
      reply.send(formattedRoles);
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  };

  exports.getRoleById = async (req, reply) => {
    const { id } = req.params;
    try {
      const role = await Role.findById(id);
      if (!role) {
        return reply.code(404).send({ error: 'Role not found' });
      }
      reply.send({ id: role._id, name: role.name });
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  };

  exports.updateRole = async (req, reply) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const role = await Role.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );

      if (!role) {
        return reply.code(404).send({ error: 'Role not found' });
      }

      reply.send({ id: role._id, name: role.name });
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  };

  exports.deleteRole = async (req, reply) => {
    const { id } = req.params;

    try {
      const role = await Role.findByIdAndDelete(id);
      if (!role) {
        return reply.code(404).send({ error: 'Role not found' });
      }

      reply.send({ message: 'Role deleted successfully' });
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  };



exports.assignPermissions = async (req, reply) => {
  try {
    const { role_id, permission_ids } = req.body;
    const records = permission_ids.map(pid => ({ role_id, permission_id: pid }));
    await RolePermission.insertMany(records);
    reply.code(201).send({ message: 'Permissions assigned to role' });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

exports.addPermissionsToRole = async (req, reply) => {
  try {
    const { role_id, permission_ids } = req.body;

    // Get existing assignments
    const existing = await RolePermission.find({ role_id });
    const existingPermissionIds = existing.map(rp => rp.permission_id.toString());

    // Filter out permissions already assigned
    const newPermissions = permission_ids.filter(pid => !existingPermissionIds.includes(pid));

    if (newPermissions.length === 0) {
      return reply.code(200).send({ message: 'All permissions already assigned' });
    }

    const records = newPermissions.map(pid => ({ role_id, permission_id: pid }));
    await RolePermission.insertMany(records);

    reply.code(200).send({ message: 'New permissions added to role' });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

exports.removePermissionsFromRole = async (req, reply) => {
  try {
    const { role_id, permission_ids } = req.body;

    const result = await RolePermission.deleteMany({
      role_id,
      permission_id: { $in: permission_ids }
    });

    reply.code(200).send({
      message: `${result.deletedCount} permissions removed from role`
    });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

exports.assignPermissions = async (req, reply) => {
  try {
    const { role_id, permission_ids } = req.body;

    // Delete old permissions first
    await RolePermission.deleteMany({ role_id });

    // Insert new assignments
    const records = permission_ids.map(pid => ({ role_id, permission_id: pid }));
    await RolePermission.insertMany(records);

    reply.code(201).send({ message: 'Permissions assigned to role (overwritten)' });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};