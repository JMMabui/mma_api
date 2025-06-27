import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createAssessmentResult, listAllAssessmentsResult, listResultsByStudent, getAssessmentsResultByAssessmentId, updateAssessmentResult, deleteAssessmentResult } from '../../models/evaluation/assessmentResult'
import type { FastifyTypeInstance } from '../../types/type'


export const AssessmentsResult: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  // POST: Criar um novo resultado de avaliação
  app.post(
    '/assessment-result',
    {
      schema: {
        tags: ['assessment-result'],
        summary: 'Criar resultado de avaliação para o aluno',
        description: 'Criar resultado de avaliação para o aluno',
        body: z.object({
          assessmentId: z.string(),
          studentId: z.string(),
          grade: z
            .number()
            .min(0, { message: 'A nota deve ser maior ou igual a 0' })
            .max(20, { message: 'A nota deve ser menor ou igual a 20' }),
        }),
      },
    },
    async (request, reply) => {
      const { assessmentId, studentId, grade } = request.body

      try {
        // Verifica se todos os dados necessários foram fornecidos
        if (!assessmentId || !studentId || grade === undefined) {
          return reply.status(400).send({
            success: false,
            message:
              'Todos os campos são obrigatórios: assessmentId, studentId, grade.',
          })
        }

        // Criação do resultado da avaliação
        const result = await createAssessmentResult({
          assessmentId,
          studentId,
          grade,
        })

        return reply.status(201).send({
          success: true,
          message: 'Resultado de avaliação criado com sucesso.',
          data: result,
        })
      } catch (error) {
        console.error('Erro ao criar resultado da avaliação:', error)
        return reply.status(500).send({
          success: false,
          message: 'Ocorreu um erro ao criar o resultado da avaliação.',
          error: (error as unknown as Error).message,
        })
      }
    }
  )

  app.get(
    '/assessment-result',
    {
      schema: {
        tags: ['assessment-result'],
        summary: 'Listar resultados todas avaliaçoes',
        description: 'Listar resultados de avaliação',
      },
    },
    async (request, reply) => {
      try {
        const results = await listAllAssessmentsResult()
        return reply.status(200).send(results)
      } catch (error) {
        console.error('Erro ao listar resultados de avaliação:', error)
        return reply.status(500).send({
          success: false,
          message: 'Ocorreu um erro ao listar os resultados da avaliação.',
          error: (error as unknown as Error).message,
        })
      }
    }
  )

  // GET: Listar resultados de avaliação de um aluno específico
  app.get(
    '/assessment-result/:studentId',
    {
      schema: {
        tags: ['assessment-result'],
        summary: 'Listar resultados de avaliação de um aluno',
        description:
          'Listar resultados de avaliação de um aluno com base no studentId',
        params: z.object({
          studentId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { studentId } = request.params

      try {
        // // Verifica se o studentId é válido
        // if (!studentId) {
        //   return reply.status(400).send({
        //     success: false,
        //     message: 'Student id invalid.',
        //   })
        // }

        // Obter todos os resultados de avaliação para o studentId fornecido
        const results = await listResultsByStudent(studentId)

        return reply.status(200).send({
          success: true,
          message: 'Resultados de avaliação do aluno listados com sucesso.',
          data: results,
        })
      } catch (error) {
        console.error('Erro ao listar resultados de avaliação do aluno:', error)
        return reply.status(500).send({
          success: false,
          message:
            'Ocorreu um erro ao listar os resultados da avaliação do aluno.',
          error: (error as unknown as Error).message,
        })
      }
    }
  )

  app.get(
    '/assessment-result/assessment/:assessmentId',
    {
      schema: {
        tags: ['assessment-result'],
        summary: 'Listar resultados de avaliação de uma avaliação',
        description:
          'Listar resultados de avaliação de uma avaliação com base no assessmentId',
        params: z.object({
          assessmentId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { assessmentId } = request.params
      try {
        const assessments =
          await getAssessmentsResultByAssessmentId(assessmentId)
        return assessments
      } catch (error) {
        console.error('Error fetching assessments:', error)
        return reply.status(500).send({
          success: false,
          message: 'An error occurred while fetching assessments.',
          error: (error as unknown as Error).message,
        })
      }
    }
  )

  // PUT: Atualizar o resultado de avaliação de um aluno
  app.put(
    '/assessment-result/:assessmentResultId',
    {
      schema: {
        tags: ['assessment-result'],
        summary: 'Atualizar resultado de avaliação para um aluno',
        description: 'Atualizar resultado de avaliação para um aluno',
        params: z.object({
          assessmentResultId: z.string(),
        }),
        body: z.object({
          grade: z.number(),
        }),
      },
    },
    async (request, reply) => {
      const { assessmentResultId } = request.params
      const { grade } = request.body

      try {
        if (grade === undefined) {
          return reply.status(400).send({
            success: false,
            message: 'O campo grade é obrigatório para atualização.',
          })
        }

        // Atualizar o resultado da avaliação
        const updatedResult = await updateAssessmentResult({
          assessmentResultId,
          grade,
        })

        return reply.status(200).send({
          success: true,
          message: 'Resultado de avaliação atualizado com sucesso.',
          data: updatedResult,
        })
      } catch (error) {
        console.error('Erro ao atualizar resultado da avaliação:', error)
        return reply.status(500).send({
          success: false,
          message: 'Ocorreu um erro ao atualizar o resultado da avaliação.',
          error: (error as unknown as Error).message,
        })
      }
    }
  )

  // DELETE: Excluir resultado de avaliação
  app.delete(
    '/assessment-result/:assessmentResultId',
    {
      schema: {
        tags: ['assessment-result'],
        summary: 'Excluir resultado de avaliação para um aluno',
        description: 'Excluir resultado de avaliação para um aluno',
        params: z.object({
          assessmentResultId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { assessmentResultId } = request.params

      try {
        // Excluir o resultado da avaliação
        const deletedResult = await deleteAssessmentResult(assessmentResultId)

        return reply.status(200).send({
          success: true,
          message: 'Resultado de avaliação excluído com sucesso.',
          data: deletedResult,
        })
      } catch (error) {
        console.error('Erro ao excluir resultado da avaliação:', error)
        return reply.status(500).send({
          success: false,
          message: 'Ocorreu um erro ao excluir o resultado da avaliação.',
          error: (error as unknown as Error).message,
        })
      }
    }
  )
}
