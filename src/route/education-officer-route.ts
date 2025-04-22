import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../types/type'
import z from 'zod'
import dayjs from 'dayjs'
import { insertEducationOffice } from '../models/educationOfficers'

export const createdStudents: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  // Definindo o schema para a criação de um estudante
  const createStudentSchema = z.object({
    fullName: z.string(),
    profession: z.string(),
    dataOfBirth: z
      .string()
      .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
        message: 'Formato de data inválido. Esperado: YYYY-MM-DD',
      }),
    email: z.string().email(),
    contact: z.string(),
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
  })

  app.post(
    '/education_officer',
    {
      schema: {
        tags: ['education officer'],
        description: 'Create education_officer',
        body: createStudentSchema,
      },
    },
    async (request, reply) => {
      // Desestruturando os dados da requisição
      const {
        fullName,
        profession,
        dataOfBirth,
        email,
        contact,
        provincyAddress,
        address,
      } = request.body

      try {
        // Inserir os dados do encarregado de educação
        const educationOfficer = await insertEducationOffice({
          address,
          contact,
          dataOfBirth: new Date(dataOfBirth),
          email,
          fullName,
          profession,
          provincyAddress,
        })

        // Resposta com status HTTP 201 e uma mensagem mais detalhada
        reply.status(201).send({
          message: 'Student created successfully',
          educationOfficer, // Presumindo que a função retorna um ID do estudante
        })
      } catch (error) {
        // Erro ao tentar criar o estudante
        reply.status(500).send({
          message: 'Failed to create student. Please try again later.',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
