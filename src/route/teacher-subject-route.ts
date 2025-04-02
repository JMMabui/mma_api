import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../type'
import z from 'zod'
import { getTeacherById } from '../models/teacher'
import {
  createTeacherSubject,
  getTeacherSubjectById,
  getTeacherSubjectByTeacherId,
  listAllTeacherSubject,
} from '../models/teacher_subject'
import { findSubjectByCodigo } from '../models/create-disciplines'

export const teacher_Subject: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/teacher_subject',
    {
      schema: {
        tags: ['teacher_subject'],
        description: 'Create relationship between teacher and subject',
        body: z.object({
          teacher_id: z.string(),
          disciplineId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { teacher_id, disciplineId } = request.body
        // Verificar se o teacher_id existe
        const teacherExists = await getTeacherById(teacher_id)
        if (!teacherExists) {
          return reply.status(404).send({
            message: 'Teacher not found',
          })
        }

        // Verificar se o disciplineId existe
        const disciplineExists = await findSubjectByCodigo(disciplineId)
        if (!disciplineExists) {
          return reply.status(404).send({
            message: 'Discipline not found',
          })
        }

        const teacher_subject = await createTeacherSubject({
          teacher_id,
          disciplineId,
        })
        reply.code(201).send({
          message: 'Relation created successfully',
          teacher_subject,
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
    '/teacher_subject',
    {
      schema: {
        tags: ['teacher_subject'],
        description: 'List all teacher_subjects',
      },
    },
    async (request, reply) => {
      try {
        const teacher_subjects = await listAllTeacherSubject()

        reply.send(teacher_subjects)
      } catch (error) {
        console.error('Database or other server error: ', error)
        reply.code(500).send({
          message: 'Internal server error, please try again later.',
        })
      }
    }
  )

  app.get(
    '/teacher_subject/:id',
    {
      schema: {
        tags: ['teacher_subject'],
        description: 'Get teacher_subject by id',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const teacher_subject = await getTeacherSubjectById(id)
      if (!teacher_subject) {
        return reply.status(404).send({
          message: 'Teacher_subject not found',
        })
      }
      reply.send(teacher_subject)
    }
  )

  app.get(
    '/teacher_subject/teacher/:teacher_id',
    {
      schema: {
        tags: ['teacher_subject'],
        description: 'Get teacher_subject by teacher_id',
        params: z.object({
          teacher_id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { teacher_id } = request.params
      const teacher_subject = await getTeacherSubjectByTeacherId(teacher_id)
      if (!teacher_subject) {
        return reply.status(404).send({
          message: 'Teacher_subject not found',
        })
      }
      reply.send(teacher_subject)
    }
  )
}
