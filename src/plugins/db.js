const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(async (fastify) => {
  await mongoose.connect(process.env.MONGO_URI)
  fastify.log.info('MongoDB connected')
})
