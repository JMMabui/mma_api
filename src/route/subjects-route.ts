import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { FastifyTypeInstance } from '../types/type'
import { prismaClient } from '../database/script'
import {
  createSubjects,
  findSubjectByCodigo,
  getAllSubjects,
  getSubjectsByCourseId,
} from '../models/subject'
export const Subjects: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  // app.post(
  //   '/subjects',
  //   {
  //     schema: {
  //       tags: ['Subjects'],
  //       description: 'create disciplines',
  //       body: z.object({
  //         codigo: z.string(),
  //         disciplineName: z.string(),
  //         year_study: z.enum([
  //           'PRIMEIRO_ANO',
  //           'SEGUNDO_ANO',
  //           'TERCEIRO_ANO',
  //           'QUARTO_ANO',
  //         ]),
  //         semester: z.enum(['PRIMEIRO_SEMESTRE', 'SEGUNDO_SEMESTRE']),
  //         hcs: z.number(),
  //         credits: z.number(),
  //         disciplineType: z.enum(['COMPLEMENTAR', 'NUCLEAR']),
  //       }),
  //     },
  //   },
  //   async (request, reply) => {
  //     try {
  //       const {
  //         codigo,
  //         credits,
  //         disciplineName,
  //         disciplineType,
  //         hcs,
  //         semester,
  //         year_study,
  //       } = request.body
  //       const subject = await createDiscipline({
  //         codigo,
  //         credits,
  //         disciplineName,
  //         disciplineType,
  //         hcs,
  //         semester,
  //         year_study,
  //       })

  //       return reply
  //         .code(201)
  //         .send({ message: 'Discipline created successfully', subject })
  //     } catch (error) {
  //       if (error instanceof z.ZodError) {
  //         return reply.status(400).send({
  //           message: 'Erro de validação',
  //           errors: error.errors,
  //         })
  //       }
  //       reply.code(500).send({ message: 'Internal server error' })
  //     }
  //   }
  // )

  app.post(
    '/subjects',
    {
      schema: {
        tags: ['Subjects'],
        description:
          'create subjects with relationsheep between subject and course ',
        body: z.object({
          codigo: z.string(),
          SubjectName: z.string(),
          year_study: z.enum([
            'PRIMEIRO_ANO',
            'SEGUNDO_ANO',
            'TERCEIRO_ANO',
            'QUARTO_ANO',
          ]),
          semester: z.enum(['PRIMEIRO_SEMESTRE', 'SEGUNDO_SEMESTRE']),
          hcs: z.number(),
          credits: z.number(),
          SubjectType: z.enum(['COMPLEMENTAR', 'NUCLEAR']),
          courseId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      // console.log('api iniciado', request.body)
      const {
        codigo,
        credits,
        SubjectName,
        SubjectType,
        hcs,
        semester,
        year_study,
        courseId,
      } = request.body

      try {
        const subject = await createSubjects({
          codigo,
          credits,
          SubjectName,
          SubjectType,
          hcs,
          semester,
          year_study,
          courseId,
        })

        return reply.code(201).send({
          sucess: true,
          message: 'Subject created successfully',
          data: subject,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            sucess: false,
            message: 'Validation error',
            errors: error.errors,
          })
        }
        reply.code(500).send({ sucess: true, message: 'Internal server error' })
      }
    }
  )

  app.get(
    '/subjects',
    {
      schema: {
        tags: ['Subjects'],
        description: 'list all disciplines',
      },
    },
    async (request, reply) => {
      try {
        const subjects = await getAllSubjects()
        if (!subjects) {
          return reply
            .status(404)
            .send({ sucess: false, message: 'No subjects found' })
        }
        return reply.status(200).send({
          sucess: true,
          message: 'Subjects found',
          data: subjects,
        })
      } catch (error) {
        console.error('Error fetching subjects:', error)
        return reply.status(500).send({
          sucess: false,
          message: 'An error occurred while fetching subjects',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/subjects/:id',
    {
      schema: {
        tags: ['Subjects'],
        description: 'search if subject exist or not using code',
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const subject = await findSubjectByCodigo(id.toUpperCase()) // Função fictícia para buscar a disciplina pelo código
      if (subject) {
        return reply.send({ exists: true, data: subject }) // Código já existe
      }
      return reply.send({ exists: false }) // Código não existe
    }
  )

  app.get(
    '/subjects/course/:courseId',
    {
      schema: {
        tags: ['Subjects'],
        description: 'Search subjects by course ID',
        params: z.object({
          courseId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      // console.log('api iniciado', request.params)
      const { courseId } = request.params

      try {
        // Tenta buscar os assuntos baseado no courseId
        const result = await getSubjectsByCourseId(courseId)

        // Se encontrar os dados, retorna uma resposta bem-sucedida
        return reply.send({
          success: true,
          message: 'Subjects Found',
          data: result,
        })
      } catch (error) {
        // Se ocorrer algum erro, retorna uma resposta de erro
        console.error('Error fetching subjects:', error) // Exibe o erro no console para debug
        return reply.status(500).send({
          success: false,
          message: 'An error occurred while fetching subjects',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
