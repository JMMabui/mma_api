import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../../types/type'
import z, { ZodError } from 'zod'
import dayjs from 'dayjs'
import { getAssessmentBySubjectId, createAssessment, listAllAssessments, getAssessmentById, updateAssessment, deleteAssessment } from '../../models/evaluation/assessment'


export const Assessments: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/assessment',
    {
      schema: {
        tags: ['assessment'],
        summary: 'Create assessments',
        description: 'Create assessments',
        body: z.object({
          name: z.string(),
          assessmentType: z.enum([
            'TESTE_INDIVIDUAL',
            'TESTE_GRUPO',
            'TRABALHO_INDIVIDUAL',
            'TRABALHO_GRUPO',
            'EXAME_NORMAL',
            'EXAME_RECORRENCIA',
            'EXAME_ESPECIAL',
          ]),
          dateApplied: z
            .string()
            .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
              message: 'Invalid date format for date of birth',
            })
            .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
          weight: z
            .number()
            .refine(val => val >= 0, {
              message: 'Weight must be a positive number',
            })
            .refine(val => val <= 100, {
              message: 'Weight must not be greater than 100',
            }),
          subjectId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { name, assessmentType, dateApplied, weight, subjectId } =
        request.body

      try {
        // Buscar todas as avaliações com o mesmo subjectId
        const assessments = await getAssessmentBySubjectId(subjectId)

        // Verificar se existe alguma avaliação do tipo EXAME_NORMAL, EXAME_RECORRENCIA ou EXAME_ESPECIAL
        const existingExams = assessments?.data?.some(assessment =>
          ['EXAME_NORMAL', 'EXAME_RECORRENCIA', 'EXAME_ESPECIAL'].includes(
            assessment.assessmentType
          )
        )

        if (existingExams) {
          return reply.code(400).send({
            success: false,
            message:
              'At least one EXAME type assessment (EXAME_NORMAL, EXAME_RECORRENCIA, EXAME_ESPECIAL) must exist before creating a new assessment.',
          })
        }

        // Calcular a soma do peso das avaliações existentes, ignorando tipos que começam com "EXAME"
        const totalWeight = Array.isArray(assessments.data)
          ? assessments.data.reduce((sum, assessment) => {
              if (!assessment.assessmentType.startsWith('EXAME')) {
                return sum + assessment.weight
              }
              return sum
            }, 0)
          : 0

        // Verificar se a soma dos pesos ultrapassa 100
        // Ignorar o peso da nova avaliação se o tipo começar com 'EXAME'
        if (weight && !assessmentType.startsWith('EXAME')) {
          // Verificar se a soma dos pesos ultrapassa 100
          if (totalWeight + weight > 100) {
            return reply.code(400).send({
              success: false,
              message:
                'Total weight exceeds 100, cannot create new assessment.',
            })
          }
        } else {
          // Se for uma avaliação do tipo EXAME, ela não é considerada no totalWeight
          console.log('Tipo EXAME, peso ignorado para comparação.')
        }

        // Criando a avaliação no banco de dados usando Prisma
        const assessment = await createAssessment({
          name,
          assessmentType,
          dateApplied,
          weight,
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
        const assessment = await getAssessmentById(id)

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

  app.get(
    '/assessment/subject/:subjectId',
    {
      schema: {
        tags: ['assessment'],
        summary: 'Get assessment by subject ID',
        description: 'Retrieve assessment data for a specific subject ID.',
        params: z.object({
          subjectId: z.string().min(1, 'subjectId is required'), // Adicionando validação mínima para subjectId
        }),
      },
    },
    async (request, reply) => {
      const { subjectId } = request.params

      try {
        const assessment = await getAssessmentBySubjectId(subjectId)

        if (
          !assessment ||
          !Array.isArray(assessment.data) ||
          assessment.data.length === 0
        ) {
          return reply.code(404).send({
            success: false,
            message: 'No assessments found for the given subject ID.',
            error: 'No data found',
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Assessment retrieved successfully.',
          data: assessment?.data.map(data => ({
            ...data,
            dateApplied: dayjs(data.dateApplied).format('YYYY-MM-DD'),
          })),
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            success: false,
            message: 'Validation error',
            errors: error.errors.map(
              err => `${err.path.join('.')}: ${err.message}`
            ),
          })
        }
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
          assessmentType: z.enum([
            'TESTE_INDIVIDUAL',
            'TESTE_GRUPO',
            'TRABALHO_INDIVIDUAL',
            'TRABALHO_GRUPO',
            'EXAME_NORMAL',
            'EXAME_RECORRENCIA',
            'EXAME_ESPECIAL',
          ]),
          dateApplied: z.string().refine(date => dayjs(date).isValid(), {
            message: 'Invalid date format',
          }),
          weight: z
            .number()
            .refine(val => val >= 0, {
              message: 'Weight must be a positive number',
            })
            .refine(val => val <= 100, {
              message: 'Weight must not be greater than 100',
            }),
          subjectId: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { name, assessmentType, dateApplied, weight, subjectId } =
        request.body
      try {
        const assessment = await updateAssessment({
          assessmentId: id,
          name,
          assessmentType,
          weight,
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

  app.delete(
    '/assessment/:assessmentId',
    {
      schema: {
        tags: ['assessment'],
        description: 'Delete assessment using assessment id',
        params: z.object({
          assessmentId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      console.log('api inicializado')
      try {
        const { assessmentId } = request.params
        const deletedAssessment = await deleteAssessment(assessmentId)

        if (!deletedAssessment) {
          return reply.status(404).send({ message: 'Assessment not found' })
        }

        return reply
          .status(200)
          .send({ message: 'Assessment deleted successfully' })
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
