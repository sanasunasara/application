const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Booking  API",
      version: "1.0.0",
      description: "API documentation for Room Booking",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.js"], // Specify the folder where routes are defined
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

//  Function to Accept `app` as Argument
const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs,{
    swaggerOptions: {
      persistAuthorization: true,
    },

}));
};

module.exports = setupSwagger;
