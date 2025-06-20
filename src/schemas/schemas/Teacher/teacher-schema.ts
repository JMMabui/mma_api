import { z } from 'zod'

export const createTeacherSchema = z.object({
  surname: z.string(),
  name: z.string(),
  email: z.string().email(),
  contact: z.string(),
  teacherType: z.enum(['DOCENTE', 'COORDENADOR']),
  statusTeacher: z.enum(['ATIVO', 'INATIVO']),
  loginId: z.string().optional(),
})

export const updateTeacherSchema = z.object({
  surname: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  contact: z.string().optional(),
  teacherType: z.enum(['DOCENTE', 'COORDENADOR']).optional(),
  statusTeacher: z.enum(['ATIVO', 'INATIVO']).optional(),
  loginId: z.string().optional(),
})

export const teacherResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    surname: z.string(),
    name: z.string(),
    email: z.string(),
    contact: z.string(),
    teacherType: z.enum(['DOCENTE', 'COORDENADOR']),
    statusTeacher: z.enum(['ATIVO', 'INATIVO']),
    loginId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export const teachersResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
      surname: z.string(),
      name: z.string(),
      email: z.string(),
      contact: z.string(),
      teacherType: z.enum(['DOCENTE', 'COORDENADOR']),
      statusTeacher: z.enum(['ATIVO', 'INATIVO']),
      loginId: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
})
