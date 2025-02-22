import combineYamlFiles from "./combineYamlFiles.js";

const docsDir = "./docs";

const combinedSpec = {
  openapi: "3.0.0",
  info: {
    title: "SartorialSys API",
    version: "3.0.0",
    description: "API for managing SartorialSys Web",
    contact: {
      name: "Joel Defaz",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  tags: [
    {
      name: "Users",
      description: "Operations relates to users manager",
    },
    {
      name: "Products",
      description: "Operations related to products manager",
    },
    {
      name: "Authentication",
      description: "Operations related to user authentication and login",
    },
    {
      name: "Carts",
      description: "Operations related to managing shopping carts",
    },
    {
      name: "Orders",
      description: "Operations related to order processing and management",
    },
  ],
  ...combineYamlFiles(docsDir),
};

export default combinedSpec;
