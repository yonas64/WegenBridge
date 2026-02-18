const swaggerJsDoc = require("swagger-jsdoc");
const serverUrl = process.env.API_BASE_URL || "http://localhost:3000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Family Reconnection API",
      version: "1.0.0",
      description: "API for reconnecting missing family members",
    },
    servers: [{ url: serverUrl }],
  },
  apis: ["./routes/*.js"],
};

//const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerJsDoc(options);
