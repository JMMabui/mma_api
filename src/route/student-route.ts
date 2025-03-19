import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import dayjs from 'dayjs'
import { createStudents, listAllStudents } from '../models/students'
import type { FastifyTypeInstance } from '../type'
import { prismaClient } from '../database/script'
import { createLogin } from '../models/login'

export const Students: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/students',
    {
      schema: {
        tags: ['students'],
        description: 'Create students',
        body: z.object({
          surname: z.string(),
          name: z.string(),
          dataOfBirth: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for date of birth' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          placeOfBirth: z.string(),
          gender: z.enum(['MASCULINO', 'FEMININO']),
          maritalStatus: z.enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO']),
          provincyAddress: z.enum([
            'MAPUTO_CIDADE',
            'MAPUTO_PROVINCIA',
            'GAZA',
            'INHAMBANE',
            'MANICA',
            'SOFALA',
            'TETE',
            'ZAMBEZIA',
            'NAMPULA',
            'CABO_DELGADO',
            'NIASSA',
          ]),
          address: z.string(),
          fatherName: z.string(),
          motherName: z.string(),
          documentType: z.enum(['BI', 'PASSAPORTE']),
          documentNumber: z.string(),
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
              { message: 'Invalid date format for document expiration date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          nuit: z.number().refine(nuit => nuit.toString().length === 9, {
            message: 'O NUIT deve ter exatamente 9 dígitos',
          }),
          login_id: z.string() || z.null(),
        }),
      },
    },
    async (request, reply) => {
      function generateId() {
        const year = new Date().getFullYear() // Obtém o ano atual
        const randomDigits = Math.floor(1000 + Math.random() * 9000) // Garante 4 dígitos aleatórios
        const id = `${year}${randomDigits}`
        return id
      }

      try {
        const {
          surname,
          name,
          dataOfBirth,
          placeOfBirth,
          gender,
          maritalStatus,
          provincyAddress,
          address,
          fatherName,
          motherName,
          documentType,
          documentNumber,
          documentIssuedAt,
          documentExpiredAt,
          nuit,
          login_id,
        } = request.body

        // Cria o estudante no banco de dados
        const student = await createStudents({
          id: generateId(),
          surname,
          name,
          dataOfBirth,
          placeOfBirth,
          gender,
          maritalStatus,
          provincyAddress,
          address,
          fatherName,
          motherName,
          documentType,
          documentNumber,
          documentIssuedAt,
          documentExpiredAt,
          nuit,
          login_id,
        })

        console.log(student)
        // Responde com o estudante criado
        reply.code(201).send(student)
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Retorna detalhes de erro de validação
          return reply.status(400).send({
            message: 'Validation error',
            details: error.errors,
          })
        }

        // Caso de erro genérico, como falha no banco
        console.error('Database or other server error: ', error)
        reply.code(500).send({
          message: 'Internal server error, please try again later.',
        })
      }
    }
  )

  app.post(
    '/login-students',
    {
      schema: {
        tags: ['students'],
        description: 'Create students',
        body: z.object({
          surname: z.string(),
          name: z.string(),
          dataOfBirth: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for date of birth' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          placeOfBirth: z.string(),
          gender: z.enum(['MASCULINO', 'FEMININO']),
          maritalStatus: z.enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO']),
          provincyAddress: z.enum([
            'MAPUTO_CIDADE',
            'MAPUTO_PROVINCIA',
            'GAZA',
            'INHAMBANE',
            'MANICA',
            'SOFALA',
            'TETE',
            'ZAMBEZIA',
            'NAMPULA',
            'CABO_DELGADO',
            'NIASSA',
          ]),
          address: z.string(),
          fatherName: z.string(),
          motherName: z.string(),
          documentType: z.enum(['BI', 'PASSAPORTE']),
          documentNumber: z.string(),
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
              { message: 'Invalid date format for document expiration date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          nuit: z.number().refine(nuit => nuit.toString().length === 9, {
            message: 'O NUIT deve ter exatamente 9 dígitos',
          }),
          email: z.string().email(),
          contact: z.string().min(9),
        }),
      },
    },
    async (request, reply) => {
      function generateId() {
        const year = new Date().getFullYear() // Obtém o ano atual
        const randomDigits = Math.floor(1000 + Math.random() * 9000) // Garante 4 dígitos aleatórios
        const id = `${year}${randomDigits}`
        return id
      }

      // console.log('api inicializada', request.body)

      try {
        const {
          surname,
          name,
          dataOfBirth,
          placeOfBirth,
          gender,
          maritalStatus,
          provincyAddress,
          address,
          fatherName,
          motherName,
          documentType,
          documentNumber,
          documentIssuedAt,
          documentExpiredAt,
          nuit,
          email,
          contact,
        } = request.body

        // Verificar se já existe um usuário com o mesmo email
        const existingLogin = await prismaClient.loginData.findFirst({
          where: {
            OR: [{ email: email }, { contact: contact }],
          },
        })

        if (existingLogin) {
          // Se já existir, retornar um erro
          return reply.status(400).send({
            message:
              'Já existe um usuário com este e-mail ou número de contato.',
          })
        }

        const passwordGenereated = generateId()
        // Cria os dados de login primeiro
        const loginData = await createLogin({
          email,
          contact,
          password: passwordGenereated,
        })

        // Cria o estudante com loginId associado
        const student = await createStudents({
          id: generateId(),
          surname,
          name,
          dataOfBirth,
          placeOfBirth,
          gender,
          maritalStatus,
          provincyAddress,
          address,
          fatherName,
          motherName,
          documentType,
          documentNumber,
          documentIssuedAt,
          documentExpiredAt,
          nuit,
          login_id: loginData.id, // Associando o loginId do login recém-criado ao estudante
        })

        // Responde com o estudante e os dados de login criados
        reply.code(201).send({
          message: 'Student created successfully',
          student,
          loginData: { email, contact },
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Retorna detalhes de erro de validação
          return reply.status(400).send({
            message: 'Validation error',
            details: error.errors,
          })
        }

        // Caso de erro genérico, como falha no banco
        console.error('Database or other server error: ', error)
        reply.code(500).send({
          message: 'Internal server error, please try again later.',
        })
      }
    }
  )

  app.get(
    '/students',
    {
      schema: {
        tags: ['students'],
        description: 'List students',
      },
    },
    async (request, reply) => {
      try {
        const students = await listAllStudents()
        reply.send(students)
      } catch (error) {
        console.error('Database error while fetching students: ', error)
        reply.code(500).send({
          message: 'Could not retrieve students, please try again later.',
        })
      }
    }
  )

  app.put(
    '/login-student/:id',
    {
      schema: {
        tags: ['update-loginId'],
        description: 'Update login_id on table student',
        body: z.object({
          studentId: z.string(), // O ID do estudante que queremos atualizar
          loginId: z.string(), // O novo login_id que queremos associar ao estudante
        }),
      },
    },
    async (request, reply) => {
      const { studentId, loginId } = request.body

      try {
        // Verifique se o loginId existe na tabela loginData
        const login = await prismaClient.loginData.findUnique({
          where: { id: loginId },
        })

        if (!login) {
          return reply.status(400).send({
            message: 'Login ID inválido, não encontrado.',
          })
        }

        // Verifique se o estudante existe
        const student = await prismaClient.student.findUnique({
          where: { id: studentId },
        })

        if (!student) {
          return reply.status(404).send({
            message: 'Estudante não encontrado.',
          })
        }

        // Atualiza o loginId do estudante
        const updatedStudent = await prismaClient.student.update({
          where: { id: studentId },
          data: {
            login_id: loginId, // Atualiza o loginId no estudante
          },
        })

        // Responde com o estudante atualizado
        return reply.code(200).send({
          message: 'Login ID atualizado com sucesso.',
          updatedStudent,
        })
      } catch (error) {
        console.error('Erro ao atualizar o loginId: ', error)
        return reply.status(500).send({
          message: 'Erro interno ao atualizar o loginId.',
        })
      }
    }
  )
}
