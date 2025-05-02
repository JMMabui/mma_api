import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import type { FastifyTypeInstance } from '../types/type'
import {
  createStudentSubject,
  getStudentSubjectsByStudentId,
  getStudentSubjectsBySubjectId,
  listAllStudentsSubjects,
} from '../models/student_subject'
import { findStudentById } from '../models/students'
import { findSubjectsByCodigos } from '../models/subject'

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
          studentId: z.string(),
          subjectsIds: z.array(z.string()), // Alterado para um array de strings
        }),
      },
    },
    async (request, reply) => {
      console.log('api iniciado post /students_subjects')
      try {
        const { studentId, subjectsIds } = request.body

        // Verificar se o student_id existe
        const studentExists = await findStudentById(studentId)
        if (!studentExists) {
          return reply.status(404).send({
            success: false,
            message: 'Student not found',
          })
        }

        // Verificar se todas as disciplinas existem
        const disciplines = await findSubjectsByCodigos(subjectsIds) // Alteração para buscar todas as disciplinas de uma vez
        if (disciplines.length !== subjectsIds.length) {
          return reply.status(404).send({
            success: false,
            message: 'One or more disciplines not found',
            data: disciplines,
          })
        }

        // Criar as relações entre o estudante e as disciplinas
        const studentSubject = await Promise.all(
          subjectsIds.map(subjectId =>
            createStudentSubject({
              studentId,
              subjectId,
            })
          )
        )

        reply.code(201).send({
          success: true,
          message: 'Relations created successfully',
          data: studentSubject,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Retorna detalhes de erro de validação
          return reply.status(400).send({
            success: false,
            message: 'Validation error',
            details: error.errors,
          })
        }

        // Caso de erro genérico, como falha no banco
        console.error('Database or other server error: ', error)
        reply.code(500).send({
          success: false,
          message: 'Internal server error, please try again later.',
          data: [],
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
      // console.log('api iniciado /students_subjects')
      try {
        const student_subject = await listAllStudentsSubjects()

        if (student_subject.length === 0) {
          reply.status(404).send({
            success: false,
            message: 'No relationships found between students and subjects',
            data: [],
          })
          return
        }
        return reply.send({
          success: true,
          message: 'Relationships found between students and subjects',
          data: student_subject,
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching student subjects:', error.message)
        } else {
          console.error('Error fetching student subjects:', error)
        }
        reply.status(500).send({
          success: false,
          message: 'Internal server error',
          data: [],
        })
      }
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
      // console.log('api iniciado', request.params)
      const { id } = request.params // Pegando o `id` do estudante a partir dos parâmetros da URL

      try {
        //Verificar se o estudante existe
        const student = await findStudentById(id)
        if (!student) {
          return reply.status(404).send({
            success: false,
            message: 'Student not found',
            data: [],
          })
        }

        // Buscando as disciplinas do estudante com o `id` fornecido
        const studentSubject = await getStudentSubjectsByStudentId(id)

        const filteredStudentSubject = studentSubject.filter(
          subject =>
            subject.status === 'INSCRITO' && subject.result === 'EM_ANDAMENTO'
        )

        // Se não encontrar nada, retorna uma mensagem de erro
        // if (studentSubject.length === 0) {
        //   return reply.status(404).send({
        //     success: true,
        //     message: 'No subjects found for this student.',
        //     data: [],
        //   })
        // }

        // Retorna as disciplinas encontradas
        return reply.send({
          success: true,
          message: 'Subjects found for this student.',
          data: studentSubject,
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching student subjects:', error.message)
        } else {
          console.error('Error fetching student subjects:', error)
        }
        reply.status(500).send({
          success: false,
          message: 'Internal server error',
          data: [],
        })
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
      // console.log('Entrou na rota de busca de disciplinas do estudante')
      const { id } = request.params // Pegando o `id` do estudante a partir dos parâmetros da URL

      try {
        // Buscando as disciplinas do estudante com o `id` fornecido
        const student = await findStudentById(id)

        const studentSubject = await getStudentSubjectsBySubjectId(id)

        // Se não encontrar nada, retorna uma mensagem de erro
        if (studentSubject.length === 0) {
          return reply.status(404).send({
            sucess: true,
            message: 'No students was found for this subject.',
            data: [],
          })
        }

        // Retorna as disciplinas encontradas
        reply.send({
          sucess: true,
          message: 'Students found for this subject.',
          data: studentSubject,
        })
      } catch (error) {
        console.error('Error fetching student subjects:', error)
        reply
          .status(500)
          .send({ sucess: false, message: 'Internal server error' })
      }
    }
  )
}
