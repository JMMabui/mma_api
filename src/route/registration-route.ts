import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { prismaClient } from '../database/script'
import type { FastifyTypeInstance } from '../types/type'
import { findCourseById, updateCourseVacancies } from '../models/course'
import {
  createRegistration,
  createRegistrationWithConfirmationStatus,
  listAllRegistrations,
} from '../models/students/registration'

export const Registrations: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/registration',
    {
      schema: {
        tags: ['registration'],
        description:
          'create relation between student and course, and see status if it is subscribed or not',
        body: z.object({
          courseId: z.string(),
          studentId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { courseId, studentId } = request.body

        // 1. Verificar se o curso ainda tem vagas disponíveis
        const course = await findCourseById(courseId)

        if (!course) {
          return reply.status(404).send({ message: 'Curso não encontrado' })
        }

        if (
          !course ||
          course.availableVacancies === null ||
          course.availableVacancies <= 0
        ) {
          return reply.status(400).send({ message: 'Não há vagas disponíveis' })
        }

        // 2. Criar o registro de inscrição entre aluno e curso
        const registration = await createRegistration({
          courseId,
          studentId,
        })

        // 3. Atualizar o número de vagas disponíveis no curso
        // await updateCourseVacancies(course_id)

        reply.code(201).send({
          message: 'Inscrição criada com sucesso',
          registration,
        })
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

  app.post(
    '/registration-status-confirmation',
    {
      schema: {
        tags: ['registration'],
        description:
          'create relation between student and course, and status by default is confirmado',
        body: z.object({
          courseId: z.string(),
          studentId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { courseId, studentId } = request.body

        // 1. Verificar se o curso ainda tem vagas disponíveis
        const course = await findCourseById(courseId)

        if (!course) {
          return reply.status(404).send({ message: 'Curso não encontrado' })
        }

        if (
          course.availableVacancies === null ||
          course?.availableVacancies === null ||
          course.availableVacancies <= 0
        ) {
          return reply.status(400).send({ message: 'Não há vagas disponíveis' })
        }

        // 2. Criar o registro de inscrição entre aluno e curso
        const registration = await createRegistrationWithConfirmationStatus({
          courseId,
          studentId,
          registrationStatus: 'CONFIRMADO',
        })

        // 3. Atualizar o número de vagas disponíveis no curso
        await updateCourseVacancies(courseId)

        reply.code(201).send({
          message: 'Inscrição criada com sucesso',
          registration,
        })
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

  app.get(
    '/registration',
    {
      schema: {
        tags: ['registration'],
        description: 'list all registration',
      },
    },
    async (request, reply) => {
      try {
        const result = await listAllRegistrations()
        reply.send({
          sucess: true,
          message: 'Registrations found',
          data: result,
        })
      } catch (error) {
        console.error('Database error while fetching registrations: ', error)
        reply.code(500).send({
          sucess: false,
          message: 'Could not retrieve courses, please try again later.',
        })
      }
    }
  )

  app.put(
    '/registration-status/:id',
    {
      schema: {
        tags: ['registration'],
        description: 'Update registration status after validating registration',
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          registrationStatus: z.enum([
            'PENDENTE',
            'CONFIRMADO',
            'CANCELADO',
            'TRANCADO',
            'INSCRITO',
            'NAO_INSCRITO',
          ]),
        }),
      },
    },
    async (request, reply) => {
      console.log('Entrou na rota de atualização de status de registro')

      try {
        const { id } = request.params // Pega o ID da URL
        const { registrationStatus } = request.body // Pega o status do corpo da requisição

        // Verificar se o registro existe
        const registration = await prismaClient.registration.findMany({
          where: { studentId: id },
        })

        if (!registration) {
          return reply.status(404).send({ message: 'Registro não encontrado' })
        }

        // Verificar se o ID do registro corresponde ao student_id (comparing `id` with `student_id`)
        if (registration.length === 0 || registration[0].studentId !== id) {
          return reply
            .status(400)
            .send({ message: 'ID do estudante não corresponde ao registro' })
        }

        // 1. Verificar se o curso ainda tem vagas disponíveis
        const course = await findCourseById(registration[0].courseId)

        if (
          !course ||
          course?.availableVacancies === null ||
          course.availableVacancies <= 0
        ) {
          return reply.status(400).send({ message: 'Não há vagas disponíveis' })
        }

        // Atualizar o status de registro para 'CONFIRMADO'
        const updatedRegistrations = await prismaClient.registration.updateMany(
          {
            where: { studentId: id }, // Atualiza todos os registros com o mesmo student_id
            data: { registrationStatus }, // Atualiza o status para 'CONFIRMADO'
          }
        )

        const course_id = registration[0].courseId
        await updateCourseVacancies(course_id)

        if (updatedRegistrations.count === 0) {
          return reply
            .status(400)
            .send({ message: 'Erro ao atualizar o status dos registros' })
        }

        return reply.code(200).send({
          message: 'Status de registro atualizado para CONFIRMADO com sucesso',
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        }

        return reply.status(500).send({ message: 'Erro interno no servidor' })
      }
    }
  )
}
