const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Family Reconnection API',
      version: '1.0.0',
      description: 'API for reconnecting missing family members',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./routes/*.js'],
};

//const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerJsDoc(options);
