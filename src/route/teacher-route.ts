import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import type { FastifyTypeInstance } from '../types/type'
import {
  createTeacher,
  listAllTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from '../models/teacher'

export const teachersData: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/teacher',
    {
      schema: {
        tags: ['teacher'],
        description: 'Create teacher',
        body: z.object({
          fullName: z.string().min(1, 'Full name is required'), // Validando que o nome não está vazio
          email: z.string().email('Invalid email format'), // Validando o formato do email
          contact: z.string().min(1, 'Contact is required'), // Validando que o contato não está vazio
          profession: z.string().min(1, 'Profession is required'), // Validando que a profissão não está vazia
          type: z.enum(['COORDENADOR', 'DOCENTE', 'AUXILIAR']), // Validando o tipo
        }),
      },
    },
    async (request, reply) => {
      try {
        // Desestruturando os dados da requisição
        const { fullName, email, contact, profession, type } = request.body

        // Chama a função para criar o professor
        const teacher = await createTeacher({
          fullName,
          email,
          contact,
          profession,
          type,
        })

        // Se a criação for bem-sucedida, retorne o status 201 (Created)
        reply.status(201).send({
          message: 'Teacher created successfully',
          teacher, // Retorne os dados do professor criado
        })
      } catch (error) {
        // Se ocorrer um erro durante a criação, retorne um erro 500 (Internal Server Error)
        console.error('Error creating teacher:', error)

        reply.status(500).send({
          message: 'An error occurred while creating the teacher',
          error: (error as Error).message,
        })
      }
    }
  )
  // Rota para listar todos os professores
  app.get(
    '/teachers',
    { schema: { tags: ['teacher'], description: 'List all teachers' } },
    async (request, reply) => {
      try {
        const teachers = await listAllTeacher()
        reply.status(200).send(teachers)
      } catch (error) {
        console.error('Error listing teachers:', error)
        reply.status(500).send({
          message: 'An error occurred while listing teachers',
          error: (error as Error).message,
        })
      }
    }
  )

  // Rota para obter um único professor
  app.get(
    '/teacher/:id',
    {
      schema: {
        tags: ['teacher'],
        description: 'Get a teacher by ID',
        params: z.object({
          id: z.string().min(1, 'Teacher ID is required'),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const teacher = await getTeacherById(id)

        if (teacher) {
          reply.status(200).send(teacher)
        } else {
          reply.status(404).send({ message: 'Teacher not found' })
        }
      } catch (error) {
        console.error('Error getting teacher by ID:', error)
        reply.status(500).send({
          message: 'An error occurred while getting the teacher',
          error: (error as Error).message,
        })
      }
    }
  )

  // Rota para atualizar professor
  app.put(
    '/teacher/:id',
    {
      schema: {
        tags: ['teacher'],
        description: 'Update teacher',
        params: z.object({
          id: z.string().min(1, 'Teacher ID is required'),
        }),
        body: z.object({
          fullName: z.string().min(1, 'Full name is required').optional(),
          email: z.string().email('Invalid email format').optional(),
          contact: z.string().min(1, 'Contact is required').optional(),
          profession: z.string().min(1, 'Profession is required').optional(),
          type: z.enum(['COORDENADOR', 'DOCENTE', 'AUXILIAR']).optional(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { fullName, email, contact, profession, type } = request.body

        const updatedTeacher = await updateTeacher(id, {
          fullName,
          email,
          contact,
          profession,
          type,
        })

        if (updatedTeacher) {
          reply.status(200).send({
            message: 'Teacher updated successfully',
            teacher: updatedTeacher,
          })
        } else {
          reply.status(404).send({ message: 'Teacher not found' })
        }
      } catch (error) {
        console.error('Error updating teacher:', error)
        reply.status(500).send({
          message: 'An error occurred while updating the teacher',
          error: (error as Error).message,
        })
      }
    }
  )

  // Rota para deletar professor
  app.delete(
    '/teacher/:id',
    {
      schema: {
        tags: ['teacher'],
        description: 'Delete teacher by ID',
        params: z.object({
          id: z.string().min(1, 'Teacher ID is required'),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const deletedTeacher = await deleteTeacher(id)

        if (deletedTeacher) {
          reply.status(200).send({
            message: 'Teacher deleted successfully',
          })
        } else {
          reply.status(404).send({ message: 'Teacher not found' })
        }
      } catch (error) {
        console.error('Error deleting teacher:', error)
        reply.status(500).send({
          message: 'An error occurred while deleting the teacher',
          error: (error as Error).message,
        })
      }
    }
  )
}
