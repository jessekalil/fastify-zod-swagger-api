import { randomUUID } from 'crypto';

import z from 'zod';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  email: z.string()
});
type User = z.infer<typeof userSchema>;

const users: User[] = [];

export const routes: FastifyPluginAsyncZod = async app => {
  app.get(
    '/ping',
    {
      schema: {
        description: 'Ping route',
        tags: ['ping'],
        summary: 'Ping route',
        response: {
          200: z.object({
            message: z.string()
          })
        }
      }
    },
    () => ({ message: 'pong' })
  );

  app.get(
    '/users',
    {
      schema: {
        description: 'Get all users',
        tags: ['users'],
        summary: 'Get all users',
        response: {
          200: z.array(userSchema)
        }
      }
    },
    async () => users
  );

  app.get(
    '/users/:id',
    {
      schema: {
        description: 'Get a user by ID',
        tags: ['users'],
        summary: 'Get a user by ID',
        params: z.object({
          id: z.string()
        }),
        response: {
          200: userSchema,
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      const user = users.find(user => user.id === id);
      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      return user;
    }
  );

  app.post(
    '/users',
    {
      schema: {
        description: 'Create a user',
        tags: ['users'],
        body: z.object({
          name: z.string(),
          age: z.number(),
          email: z.string().email()
        }),
        response: {
          201: userSchema
        }
      }
    },
    async (request, _reply) => {
      const user = { id: randomUUID(), ...request.body };

      users.push(user);

      return user;
    }
  );

  app.put(
    '/users/:id',
    {
      schema: {
        description: 'Update a user by ID',
        tags: ['users'],
        summary: 'Update a user by ID',
        params: z.object({
          id: z.string()
        }),
        body: z.object({
          name: z.string(),
          age: z.number(),
          email: z.string().email()
        }),
        response: {
          200: userSchema,
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      const user = users.find(user => user.id === id);
      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      const updatedUser = { ...user, ...request.body };
      users[users.indexOf(user)] = updatedUser;

      return updatedUser;
    }
  );

  app.delete(
    '/users/:id',
    {
      schema: {
        description: 'Delete a user by ID',
        tags: ['users'],
        summary: 'Delete a user by ID',
        params: z.object({
          id: z.string()
        }),
        response: {
          204: z.null().describe('No content'),
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      const user = users.find(user => user.id === id);
      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      users.splice(users.indexOf(user), 1);

      return null;
    }
  );
};
