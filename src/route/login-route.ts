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
    where: { loginId: id },
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
          jobPosition: z.enum([
            'ADMIN_IT',
            'CTA_ADMIN_FINANCEIRO',
            'CTA_ADMIN_REG_ACADEMICO',
            'CTA_ADMIN_RH',
            'CTA_ADMIN_BIBLIOTECA',
            'CTA_ADMIN_COORDENADOR',
            'CTA_REG_ACADEMICO',
            'CTA_FINANCEIRO',
            'CTA_BIBLIOTECA',
            'CTA_DOCENTE',
            'CTA_RH',
            'CTA',
            'ESTUDANTE',
          ]),
        }),
        response: {
          201: z.object({
            message: z.string(),
            sucess: z.boolean(),
            data: z.object({
              id: z.string(),
              email: z.string(),
              contact: z.string(),
              jobPosition: z.string(),
              createdAt: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
            sucess: z.boolean(),
            errors: z.array(z.object({ message: z.string() })).optional(),
          }),
          500: z.object({
            message: z.string(),
            sucess: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password, contact, jobPosition } = request.body

        const existingUser = await findUserByEmail(email)

        if (existingUser) {
          return reply.status(400).send({
            message: 'Já existe um usuário com este email.',
            sucess: false,
          })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const login = await createLogin({
          email,
          contact,
          password: hashedPassword,
          jobPosition,
        })

        reply.code(201).send({
          message: 'Login criado com sucesso',
          sucess: true,
          data: {
            ...login,
            createdAt: login.createdAt.toISOString(),
          },
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            sucess: false,
            errors: error.errors,
          })
        }
        reply
          .code(500)
          .send({ message: 'Internal server error', sucess: false })
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

        // Buscar o usuário pelo e-mail
        const user = await findUserByEmail(email)

        if (!user) {
          return reply.status(400).send({
            message: 'Email inválido.',
          })
        }

        // Comparar a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          return reply.status(400).send({
            message: 'Senha inválida.',
          })
        }

        // Buscar informações do estudante
        const student = await findStudentId(user.id)

        // Verificar o tipo de usuário (userType)
        const userType = user.jobPosition // Supondo que a posição do usuário seja armazenada em `jobPosition`

        // Gerar o token JWT
        const token = generateToken(user.id)

        // Estrutura de dados base para a resposta
        const responseData = {
          success: true,
          message: 'Login realizado com sucesso.',
          data: {
            token,
            user,
            ...(userType === 'ESTUDANTE' && { student }),
          },
        }

        // Resposta com base na posição do usuário
        reply.code(200).send(responseData)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        }
        reply.code(500).send({ message: 'Erro interno do servidor' })
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
          jobPosition: z.enum([
            'ADMIN_IT',
            'CTA_ADMIN_FINANCEIRO',
            'CTA_ADMIN_REG_ACADEMICO',
            'CTA_ADMIN_RH',
            'CTA_ADMIN_BIBLIOTECA',
            'CTA_ADMIN_COORDENADOR',
            'CTA_REG_ACADEMICO',
            'CTA_FINANCEIRO',
            'CTA_BIBLIOTECA',
            'CTA_DOCENTE',
            'CTA_RH',
            'CTA',
            'ESTUDANTE',
          ]),
        }),

        response: {
          200: z.object({
            message: z.string(),
            sucess: z.boolean(),
            data: z.object({
              email: z.string(),
              contact: z.string(),
              jobPosition: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
            sucess: z.boolean(),
            errors: z.array(z.object({ message: z.string() })).optional(),
          }),
          500: z.object({
            message: z.string(),
            sucess: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { email, password, contact, jobPosition } = request.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const login = await updateLogin(id, {
          email,
          password: hashedPassword,
          contact,
          jobPosition,
        })
        return reply.code(200).send({
          sucess: true,
          message: 'Login atualizado com sucesso',
          data: login,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            sucess: false,
            message: 'Erro de validação',
            errors: error.errors,
          })
        }
      }
      reply.code(500).send({ sucess: false, message: 'Internal server error' })
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
