const User = require("../../models/User");
const Role = require("../../models/Role");

exports.assignRoleToUser = async (req, reply) => {
  const { userId, roleName } = req.body;
  const role = await Role.findOne({ name: roleName });
  if (!role) return reply.code(400).send({ error: "Invalid role name" });

  const user = await User.findByIdAndUpdate(userId, { role_id: role._id }, { new: true });
  if (!user) return reply.code(404).send({ error: "User not found" });

  reply.send({ message: `Role ${roleName} assigned to user successfully.` });
};

exports.listAllRoles = async (_req, reply) => {
  const roles = await Role.find();
  reply.send(roles);
};