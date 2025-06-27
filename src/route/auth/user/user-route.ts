import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import z from 'zod'
import dayjs from 'dayjs'
import { userModel } from '../../../models/user'
import type { FastifyTypeInstance } from '../../../types/type'

export const UserRoutes: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/user',
    {
      schema: {
        tags: ['user'],
        summary: 'Create user data',
        description: 'Create all data of user',
        body: z.object({
          name: z.string().min(3).max(50),
          surname: z.string().min(3).max(50),
          dateOfBirth: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),

          gender: z.enum(['MASCULINO', 'FEMININO']),
          identificationDocument: z.enum(['BI', 'PASSAPORTE']),
          identificationNumber: z.string().min(3).max(50),
          documentIssuedAt: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          documentExpiredAt: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          taxIdentificationNumber: z.number().positive(),
          maritalStatus: z.enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO']),
          address: z.string().min(3).max(50),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          surname,
          name,
          gender,
          dateOfBirth,
          address,
          maritalStatus,
          documentExpiredAt,
          documentIssuedAt,
          identificationDocument,
          identificationNumber,
          taxIdentificationNumber,
        } = request.body

        const user = await userModel.create({
          surname,
          name,
          gender,
          dateOfBirth,
          address,
          maritalStatus,
          documentExpiredAt,
          documentIssuedAt,
          identificationDocument,
          identificationNumber,
          taxIdentificationNumber,
        })

        return reply
          .status(201)
          .send({ sucess: true, message: 'user created', data: user })
      } catch (error) {
        app.log.error(error)
        return reply.status(500).send('Internal Server Error')
      }
    }
  )

  app.get(
    '/user',
    {
      schema: {
        tags: ['user'],
        summary: 'Get all user data',
        description: 'Get all user data',
      },
    },
    async (request, reply) => {
      try {
        const users = userModel.findAllUsers()
        if (!users) {
          return reply.status(404).send('User not found')
        }

        return reply
          .status(200)
          .send({ sucess: true, message: 'user founded', data: users })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/user/:id',
    {
      schema: {
        tags: ['user'],
        summary: 'Get user data by id',
        description: 'Get user data by id',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const user = await userModel.findById(id)
        if (!user) {
          return reply.status(404).send('User not found')
        }
        return reply.status(200).send({
          sucess: true,
          message: 'user founded',
          data: user,
        })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.put(
    '/user/:id',
    {
      schema: {
        tags: ['user'],
        summary: 'Update user data by id',
        description: 'Update user data by id',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(3).max(50).optional(),
          surname: z.string().min(3).max(50).optional(),
          dateOfBirth: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            })
            .optional(),
          gender: z.enum(['MASCULINO', 'FEMININO']).optional(),
          identificationDocument: z.enum(['BI', 'PASSAPORTE']).optional(),
          identificationNumber: z.string().min(3).max(50).optional(),
          documentIssuedAt: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            })
            .optional(),
          documentExpiredAt: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            })
            .optional(),
          taxIdentificationNumber: z.number().positive().optional(),
          maritalStatus: z
            .enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO'])
            .optional(),
          address: z.string().min(3).max(50).optional(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const {
          surname,
          name,
          gender,
          dateOfBirth,
          address,
          maritalStatus,
          documentExpiredAt,
          documentIssuedAt,
          identificationDocument,
          identificationNumber,
          taxIdentificationNumber,
        } = request.body
        const user = await userModel.updateUser(id, {
          surname,
          name,
          gender,
          dateOfBirth,
          address,
          maritalStatus,
          documentExpiredAt,
          documentIssuedAt,
          identificationDocument,
          identificationNumber,
          taxIdentificationNumber,
        })

        return reply.status(200).send({
          sucess: true,
          message: 'user updated',
          data: user,
        })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.delete(
    '/user/:id',
    {
      schema: {
        tags: ['user'],
        summary: 'Delete user data by id',
        description: 'Delete user data by id',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const user = await userModel.deleteUser(id)
        if (!user) {
          return reply.status(404).send('User not found')
        }
        return reply.status(200).send({
          sucess: true,
          message: 'user deleted',
          data: user,
        })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.delete(
    '/user',
    {
      schema: {
        tags: ['user'],
        summary: 'Delete all user data',
        description: 'Delete all user data',
      },
    },
    async (request, reply) => {
      try {
        const user = await userModel.deleteAllUsers()
        if (!user) {
          return reply.status(404).send('User not found')
        }
        return reply.status(200).send({
          sucess: true,
          message: 'user deleted',
          data: user,
        })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
