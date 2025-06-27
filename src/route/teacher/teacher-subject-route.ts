import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import type { FastifyTypeInstance } from '../../types/type'
import { prismaClient } from '../../database/script'


interface Schema {
  teacherId: string
  subjectId: string
}

export const TeacherSubject: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  app.post(
    '/teacher-subject',
    {
      schema: {
        body: z.object({
          teacherId: z.string(),
          subjectId: z.string(),
        }),
        response: {
          201: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              id: z.string(),
              teacherId: z.string(),
              subjectId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { teacherId, subjectId } = request.body

      const teacher_subject = await prismaClient.teacherSubject.create({
        data: {
          teacherId,
          subjectId,
        },
      })

      return reply.code(201).send({
        success: true,
        message: 'Teacher subject created successfully',
        data: teacher_subject,
      })
    }
  )

  app.get(
    '/teacher-subject',
    {
      schema: {
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.array(
              z.object({
                id: z.string(),
                teacherId: z.string(),
                subjectId: z.string(),
                Subject: z.any(),
                teacher: z.any(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const teacher_subjects = await prismaClient.teacherSubject.findMany({
        select: {
          id: true,
          teacherId: true,
          subjectId: true,
          Subject: true,
          teacher: true,
        },
      })

      return reply.code(200).send({
        success: true,
        message: 'Teacher subjects retrieved successfully',
        data: teacher_subjects,
      })
    }
  )

  app.get(
    '/teacher-subject/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              id: z.string(),
              teacherId: z.string(),
              subjectId: z.string(),
            }),
          }),
          404: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.null(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const teacher_subject = await prismaClient.teacherSubject.findUnique({
        where: { id },
      })

      if (!teacher_subject) {
        return reply.code(404).send({
          success: false,
          message: 'Teacher subject not found',
          data: null,
        })
      }

      return reply.code(200).send({
        success: true,
        message: 'Teacher subject retrieved successfully',
        data: teacher_subject,
      })
    }
  )

  app.get(
    '/teacher-subject/teacher/:teacherId',
    {
      schema: {
        params: z.object({
          teacherId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { teacherId } = request.params
      const teacher_subjects = await prismaClient.teacherSubject.findMany({
        where: { teacherId },
        include: {
          Subject: {},
          teacher: {},
        },
      })

      return reply.code(200).send({
        success: true,
        message: 'Teacher subjects retrieved successfully',
        data: teacher_subjects,
      })
    }
  )

  app.delete(
    '/teacher-subject/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              id: z.string(),
              teacherId: z.string(),
              subjectId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const teacher_subject = await prismaClient.teacherSubject.delete({
        where: { id },
      })

      return reply.code(200).send({
        success: true,
        message: 'Teacher subject deleted successfully',
        data: teacher_subject,
      })
    }
  )

  app.patch(
    '/teacher-subject/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          teacherId: z.string().optional(),
          subjectId: z.string().optional(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              id: z.string(),
              teacherId: z.string(),
              subjectId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const data = request.body

      const teacher_subject = await prismaClient.teacherSubject.update({
        where: { id },
        data: { ...data },
      })

      return reply.code(200).send({
        success: true,
        message: 'Teacher subject updated successfully',
        data: teacher_subject,
      })
    }
  )
}
