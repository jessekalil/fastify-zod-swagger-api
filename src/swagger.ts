import { FastifyInstance } from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

const swagger = (app: FastifyInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Fastify API',
        description: 'API documentation for Fastify',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server'
        }
      ],
      tags: [
        {
          name: 'users',
          description: 'User operations'
        }
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header'
          }
        }
      },
      externalDocs: {
        url: 'https://fastify.io',
        description: 'Fastify documentation'
      }
    },
    transform: jsonSchemaTransform
  });
};

// @ts-ingore: This is a workaround to avoid the error
swagger[Symbol.for('skip-override')] = true;
export { swagger };
