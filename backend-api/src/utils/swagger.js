import combineYamlFiles from './combineYamlFiles.js';

const docsDir = './docs';
 
const combinedSpec = {
  openapi: '3.0.0',
        info: {
            title: 'SartorialSys API',
            version: '2.0.0',
            description: 'API for managing SartorialSys WEb',
            contact: {
                name: 'Joel Defaz'
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Local server'
                }
            ]
        },
        tags: [
          {
            name: 'Users',
            description: 'Operations relates to users manager'
          },
          {
            name: 'Products',
            description: 'Operations related to products manager'
          }
        ],
  ...combineYamlFiles(docsDir),
};

export default combinedSpec;