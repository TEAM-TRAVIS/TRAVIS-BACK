// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const options = {
  info: {
    title: 'TEST API Docs',
    description: 'test api 문서입니다',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};

const outputFile = './public/common/swagger-output.json';
const endpointsFiles = ['./routes/*.js', './models/*.js', './controllers/*.js'];
swaggerAutogen(outputFile, endpointsFiles, options);
