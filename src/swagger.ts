import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "EconoView",
    version: "1.0.0",
    description: "App para gerenciamento de finanças pessoais",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // caminho para os arquivos que terão comentários JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
