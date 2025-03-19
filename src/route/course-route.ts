import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prismaClient } from '../database/script'
import { z } from 'zod'
import {
  createCourse,
  findCourseById,
  findRelationshipBetweenCourseStudents,
  listAllCourses,
} from '../models/course'
import type { FastifyTypeInstance } from '../type'

export const Courses: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  // Rota para criar um novo curso
  app.post(
    '/courses',
    {
      schema: {
        tags: ['course'],
        description: 'create course',
        body: z.object({
          courseName: z.string(),
          courseDuration: z.number(),
          courseDescription: z.string(),
          levelCourse: z.enum([
            'CURTA_DURACAO',
            'TECNICO_MEDIO',
            'LICENCIATURA',
            'MESTRADO',
            'RELIGIOSO',
          ]),
          period: z.enum(['LABORAL', 'POS_LABORAL']),
          totalVacancies: z.number(),
          availableVacancies: z.number(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          availableVacancies,
          courseDescription,
          courseDuration,
          courseName,
          levelCourse,
          period,
          totalVacancies,
        } = request.body
        const course = await createCourse({
          courseName,
          courseDuration,
          courseDescription,
          levelCourse,
          period,
          totalVacancies,
          availableVacancies,
        })

        return reply.code(201).send(course)
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

  // Rota para listar todos os cursos
  app.get(
    '/course',
    {
      schema: {
        tags: ['course'],
        description: 'list all course',
      },
    },
    async (request, reply) => {
      try {
        const course = await listAllCourses()
        reply.send(course)
      } catch (error) {
        console.error('Database error while fetching students: ', error)
        reply.code(500).send({
          message: 'Could not retrieve courses, please try again later.',
        })
      }
    }
  )

  // Rota para listar um curso específico
  app.get(
    '/course/:id',
    {
      schema: {
        tags: ['course'],
        description: 'list course by id',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string(),
      })

      const result = paramsSchema.safeParse(request.params)

      if (!result.success) {
        return reply.status(400).send({
          message: 'ID inválido',
          errors: result.error.errors,
        })
      }
      const { id } = result.data

      const course = await findCourseById(id)

      if (!course) {
        return reply.status(404).send({ message: 'Curso não encontrado' })
      }

      return reply.status(200).send(course)
    }
  )

  // Rota para listar todos os estudantes inscritos em um curso
  app.get(
    '/course-student/:id',
    {
      schema: {
        tags: ['course'],
        description: 'List all students by course',
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            course: z
              .object({
                levelCourse: z.string(),
                courseName: z.string(),
                period: z.string(),
                Registration: z.array(
                  z.object({
                    student: z.object({
                      id: z.string(),
                      createdAt: z.date(),
                      updatedAt: z.date(),
                      name: z.string(),
                      surname: z.string(),
                      email: z.string().optional(),
                      phone: z.string().optional(),
                      dataOfBirth: z.date().optional(),
                      placeOfBirth: z.string().optional(),
                      gender: z.string().optional(),
                      maritalStatus: z.string().optional(),
                      login_id: z.string().nullable().optional(),
                    }),
                  })
                ),
              })
              .nullable(),
            countStudentRegistration: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      // Buscando o curso e os estudantes registrados
      const course = await findRelationshipBetweenCourseStudents(id)

      // Verificando se o curso foi encontrado
      if (!course) {
        return reply.status(404).send({
          message: 'Curso não encontrado',
          course,
          countStudentRegistration: 0,
        })
      }

      // Contando o número de estudantes registrados no curso específico
      const countStudentRegistration = await prismaClient.registration.count({
        where: { course_id: id },
      })

      // Retornando a resposta conforme esperado
      return reply.status(200).send({
        message: 'Curso encontrado',
        course, // Dados do curso
        countStudentRegistration,
      })
    }
  )

  // Rota para listar todos os estudantes inscritos em um curso
  app.get('/student-course/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const result = paramsSchema.safeParse(request.params)

    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }
    const { id } = result.data

    const student = await prismaClient.student.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        Registration: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!student) {
      return reply.status(404).send({ message: 'Estudante não encontrado' })
    }

    return reply.status(200).send({ message: 'Estudante encontrado', student })
  })
}
