import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../type'
import z, { date } from 'zod'
import dayjs from 'dayjs'
import {
  createAssessment,
  getAssessmentBySubjectId,
  listAllAssessments,
  updateAssessment,
} from '../models/assessment'

export const Assessments: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/assessment',
    {
      schema: {
        tags: ['assessment'],
        summary: 'create assessments',
        description: 'create assessments',
        body: z.object({
          name: z.string(),
          type: z.string(),
          dateApplied: z
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
          subjectId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { name, type, dateApplied, subjectId } = request.body

        // Criando a avaliação no banco de dados usando Prisma
        const assessment = await createAssessment({
          name,
          type,
          dateApplied: dayjs(dateApplied).toDate(),
          subjectId,
        })

        return reply.code(201).send({
          success: true,
          message: 'Assessment created successfully.',
          data: assessment,
        })
      } catch (error) {
        console.error('Error creating assessment:', error)
        return reply.code(500).send({
          success: false,
          message: 'An error occurred while creating the assessment.',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/assessment',
    {
      schema: {
        tags: ['assessment'],
        summary: 'Get all assessments',
        description: 'Get all assessments',
      },
    },
    async (request, reply) => {
      try {
        const assessments = await listAllAssessments()

        return reply.code(200).send({
          success: true,
          message: 'Assessments retrieved successfully.',
          data: assessments,
        })
      } catch (error) {
        console.error('Error retrieving assessments:', error)
        return reply.code(500).send({
          success: false,
          message: 'An error occurred while retrieving the assessments.',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // GET - Listar uma avaliação específica pelo ID
  app.get(
    '/assessment/:id',
    {
      schema: {
        tags: ['assessment'],
        summary: 'Get assessment by ID',
        description: 'Get an assessment by its ID',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      try {
        const assessment = await getAssessmentBySubjectId(id)

        if (!assessment) {
          return reply.code(404).send({
            success: false,
            message: 'Assessment not found.',
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Assessment retrieved successfully.',
          data: assessment,
        })
      } catch (error) {
        console.error('Error retrieving assessment:', error)
        return reply.code(500).send({
          success: false,
          message: 'An error occurred while retrieving the assessment.',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // PUT - Atualizar avaliação
  app.put(
    '/assessment/:id',
    {
      schema: {
        tags: ['assessment'],
        summary: 'Update an assessment',
        description: 'Update an existing assessment by its ID',
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string(),
          type: z.string(),
          dateApplied: z.string().refine(date => dayjs(date).isValid(), {
            message: 'Invalid date format',
          }),
          subjectId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { name, type, dateApplied, subjectId } = request.body
      const assessmentId = id
      try {
        const assessment = await updateAssessment({
          assessmentId,
          name,
          type,
          dateApplied: dayjs(dateApplied).toDate(),
          subjectId,
        })

        return reply.code(200).send({
          success: true,
          message: 'Assessment updated successfully.',
          data: assessment,
        })
      } catch (error) {
        console.error('Error updating assessment:', error)
        return reply.code(500).send({
          success: false,
          message: 'An error occurred while updating the assessment.',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
