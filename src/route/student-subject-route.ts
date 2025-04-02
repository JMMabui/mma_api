import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import type { FastifyTypeInstance } from '../type'
import {
  createStudentSubject,
  getStudentSubjectsByStudentId,
  getStudentSubjectsBySubjectId,
  listAllStudentsSubjects,
} from '../models/student_subject'
import { findStudentById } from '../models/students'
import { findSubjectsByCodigos } from '../models/create-disciplines'

export const Student_Subject: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/students_subjects',
    {
      schema: {
        tags: ['students_subjects'],
        description: 'Create relationship between student and subjects',
        body: z.object({
          student_id: z.string(),
          disciplineIds: z.array(z.string()), // Alterado para um array de strings
        }),
      },
    },
    async (request, reply) => {
      try {
        const { student_id, disciplineIds } = request.body

        // Verificar se o student_id existe
        const studentExists = await findStudentById(student_id)
        if (!studentExists) {
          return reply.status(404).send({
            message: 'Student not found',
          })
        }

        // Verificar se todas as disciplinas existem
        const disciplines = await findSubjectsByCodigos(disciplineIds) // Alteração para buscar todas as disciplinas de uma vez
        if (disciplines.length !== disciplineIds.length) {
          return reply.status(404).send({
            message: 'One or more disciplines not found',
          })
        }

        // Criar as relações entre o estudante e as disciplinas
        await Promise.all(
          disciplineIds.map(disciplineId =>
            createStudentSubject({
              student_id,
              disciplineId,
            })
          )
        )

        reply.code(201).send({
          message: 'Relations created successfully',
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
    '/students_subjects',
    {
      schema: {
        tags: ['students_subjects'],
        description: 'List all students and subjects',
      },
    },
    async (request, reply) => {
      const student_subject = await listAllStudentsSubjects()
      console.log(student_subject)
      return student_subject
    }
  )

  app.get(
    '/students_subjects/:id', // Rota que inclui o ID do estudante
    {
      schema: {
        tags: ['students_subjects'],
        description: 'List all subjects for a specific student by ID',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params // Pegando o `id` do estudante a partir dos parâmetros da URL

      try {
        // Buscando as disciplinas do estudante com o `id` fornecido
        const studentSubject = await getStudentSubjectsByStudentId(id)

        // Se não encontrar nada, retorna uma mensagem de erro
        if (studentSubject.length === 0) {
          reply
            .status(404)
            .send({ message: 'No subjects found for this student.' })
          return
        }

        // Retorna as disciplinas encontradas
        return studentSubject
      } catch (error) {
        console.error('Error fetching student subjects:', error)
        reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )

  app.get(
    '/students_subjects/subject/:id', // Rota que inclui o ID do estudante
    {
      schema: {
        tags: ['students_subjects'],
        description: 'List all students for a specific subject by ID',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params // Pegando o `id` do estudante a partir dos parâmetros da URL

      try {
        // Buscando as disciplinas do estudante com o `id` fornecido
        const studentSubject = await getStudentSubjectsBySubjectId(id)

        // Se não encontrar nada, retorna uma mensagem de erro
        if (studentSubject.length === 0) {
          reply
            .status(404)
            .send({ message: 'No students found for this subject.' })
          return
        }

        // Retorna as disciplinas encontradas
        return studentSubject
      } catch (error) {
        console.error('Error fetching student subjects:', error)
        reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
