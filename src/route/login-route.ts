import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prismaClient } from '../database/script'
import jwt from 'jsonwebtoken'
import type { FastifyTypeInstance } from '../type'
import { createLogin, deleteLogin, updateLogin } from '../models/login'

// Função para encontrar o usuário por email
async function findUserByEmail(email: string) {
  return prismaClient.loginData.findUnique({
    where: { email },
  })
}

async function findStudentId(id: string) {
  const student_id = prismaClient.student.findUnique({
    where: { login_id: id },
    select: {
      id: true,
    },
  })

  return student_id
}

// Função para gerar o JWT token
function generateToken(userId: string) {
  const payload = { userId }
  const secretKey = process.env.JWT_SECRET || 'your-secret-key' // Use a chave secreta do ambiente
  const options = { expiresIn: 3600 } // Token expira em 1 hora (3600 segundos)
  return jwt.sign(payload, secretKey, options)
}

export const Login: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  // Rota de criação de dados de acesso
  app.post(
    '/signup',
    {
      schema: {
        tags: ['login'],
        description: 'create credential to login',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
          contact: z.string().min(9),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { email, password, contact } = request.body

        const existingUser = await findUserByEmail(email)

        if (existingUser) {
          return reply.status(400).send({
            message: 'Já existe um usuário com este email.',
          })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const login = await createLogin({
          email,
          contact,
          password: hashedPassword,
        })

        reply.code(201).send({ login })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        }
        reply.code(500).send({ message: 'Internal server error' })
      }
    }
  )

  // Rota para autenticação/login
  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['login'],
        description: 'login',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body

        const user = await findUserByEmail(email)

        if (!user) {
          return reply.status(400).send({
            message: 'Email inválidos.',
          })
        }

        // Comparar a senha fornecida com a armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          return reply.status(400).send({
            message: 'Senha inválidos.',
          })
        }

        const student_id = await findStudentId(user.id)

        // Gerar o token JWT
        const token = generateToken(user.id)

        reply.code(200).send({
          message: 'Login realizado com sucesso.',
          token,
          student_id,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        }
        reply.code(500).send({ message: 'Internal server error' })
      }
    }
  )

  // Rota para buscar todos os dados de login
  app.get(
    '/login',
    {
      schema: {
        tags: ['login'],
        description: 'list all login',
      },
    },
    async (request, reply) => {
      const login = await prismaClient.loginData.findMany()
      return login
    }
  )

  app.put(
    '/login/:id',
    {
      schema: {
        tags: ['login'],
        description: 'update login by id',
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
          contact: z.string().min(9),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { email, password, contact } = request.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const login = await updateLogin(id, {
          email,
          password: hashedPassword,
          contact,
        })
        return reply
          .code(200)
          .send({ message: 'Login atualizado com sucesso', login })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        }
      }
      reply.code(500).send({ message: 'Internal server error' })
    }
  )

  app.delete(
    '/login/:id',
    {
      schema: {
        tags: ['login'],
        description: 'delete login by id',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const login = await deleteLogin(id)
      return reply
        .code(200)
        .send({ message: 'Login excluído com sucesso', login })
    }
  )
}
