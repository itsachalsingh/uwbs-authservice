module.exports = function authorize(...roles) {
  return async (req, reply) => {
    const user = await req.jwtVerify()
    if (!roles.includes(user.role)) {
      return reply.code(403).send({ error: 'Forbidden' })
    }
  }
}
