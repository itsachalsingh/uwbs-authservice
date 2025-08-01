require('dotenv').config()
const seedDefaultRoles = require('./utils/seedDefaultRoles');
const createDefaultSuperAdmin = require('./utils/initSuperAdmin');

const fastify = require('fastify')({
  logger: true,
  ajv: {
    customOptions: {
      strict: false,
      keywords: ['example'] // ✅ allow `example` keyword
    }
  }
});

const startTokenVerifyConsumer = require('../src/rpc/tokenVerifyConsumer');

// Plugins
fastify.register(require('./plugins/jwt'))
fastify.register(require('./plugins/db'))
fastify.register(require('./plugins/swagger'))

// Routes
fastify.register(require('./routes/auth'))

seedDefaultRoles()
.then(() => {
  console.log("✅ Default roles seeded.");
})
.catch((err) => {
  console.log("❌ Error seeding tehsils:", err);
});

const start = async () => {
  try {

    await fastify.ready();
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    
    await createDefaultSuperAdmin();


    await startTokenVerifyConsumer();

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
