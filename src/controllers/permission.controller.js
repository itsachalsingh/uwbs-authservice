const Permission = require('../models/Permission');

exports.createPermission = async (req, reply) => {
  try {
    const { name } = req.body;
    const permission = await Permission.create({ name });
    reply.code(201).send({ id: permission._id, name: permission.name });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

exports.getAllPermissions = async (req, reply) => {
  try {
    const permissions = await Permission.find();
    const result = permissions.map(p => ({
      id: p._id,
      name: p.name
    }));
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};


exports.getPermissionById = async (req, reply) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findById(id);
    if (!permission) {
      return reply.code(404).send({ error: 'Permission not found' });
    }
    reply.send({ id: permission._id, name: permission.name });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

exports.updatePermission = async (req, reply) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updated = await Permission.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return reply.code(404).send({ error: 'Permission not found' });
    }

    reply.send({ id: updated._id, name: updated.name });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};


exports.deletePermission = async (req, reply) => {
  const { id } = req.params;

  try {
    const deleted = await Permission.findByIdAndDelete(id);
    if (!deleted) {
      return reply.code(404).send({ error: 'Permission not found' });
    }

    reply.send({ message: 'Permission deleted successfully' });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};


