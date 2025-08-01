const User = require("../../models/User");
const Role = require("../../models/Role");

exports.updateProfileHandler = async (req, reply) => {
  const { first_name, last_name, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { first_name, last_name, email },
    { new: true, select: "id first_name last_name email" }
  );
  if (!updatedUser) return reply.code(404).send({ error: "User not found" });
  reply.send(updatedUser);
};

exports.getUserProfileHandler = async (req, reply) => {
  const user = await User.findById(req.user.id).populate("role_id", "name");
  if (!user) return reply.code(404).send({ error: "User not found" });
  reply.send({
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    mobile_number: user.mobile_number,
    role_id: user.role_id,
    is_mobile_number_verified: user.is_mobile_number_verified,
    consumerCode: user.consumerCode,
  });
};

exports.deleteUserHandler = async (req, reply) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return reply.code(404).send({ error: "User not found" });
  reply.send({ message: "User deleted successfully" });
};

exports.getAllUsersHandler = async (req, reply) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "roles",
        localField: "role_id",
        foreignField: "_id",
        as: "role"
      }
    },
    { $unwind: "$role" },
    { $match: { "role.name": "user" } },
    { $project: { password: 0 } }
  ]);
  reply.send(users);
};

exports.getAllAdminsHandler = async (req, reply) => {
  const admins = await User.aggregate([
    {
      $lookup: {
        from: "roles",
        localField: "role_id",
        foreignField: "_id",
        as: "role"
      }
    },
    { $unwind: "$role" },
    { $match: { "role.name": { $ne: "user" } } },
    { $project: { password: 0 } }
  ]);
  reply.send(admins);
};

exports.getSingleUserHandler = async (req, reply) => {
  const user = await User.findById(req.body.id);
  if (!user) return reply.code(404).send({ error: "User not found" });
  reply.send(user);
};