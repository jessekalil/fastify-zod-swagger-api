import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from 'fastify-type-provider-zod';

import { swagger } from './swagger';
import { routes } from './routes';

const app = fastify({
  logger: true
})
  .withTypeProvider<ZodTypeProvider>()
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler);

app.register(swagger);
app.register(routes);

app.setErrorHandler((err, req, reply) => {
  app.log.error(err);

  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: err.validation,
        method: req.method,
        url: req.url
      }
    });
  }

  if (isResponseSerializationError(err)) {
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: err.cause.issues,
        method: err.method,
        url: err.url
      }
    });
  }

  reply.code(500).send({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    statusCode: 500
  });
});

export { app };
