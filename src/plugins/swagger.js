const fp = require('fastify-plugin');

module.exports = fp(async (fastify) => {
  await fastify.register(require('@fastify/swagger'), {
    mode: 'dynamic',
    openapi: {
      info: {
        title: 'Auth Service API',
        description: 'Swagger documentation for auth service',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  });

  
});
