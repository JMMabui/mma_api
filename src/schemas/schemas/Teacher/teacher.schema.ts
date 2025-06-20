import { z } from 'zod'

export const teacherSchema = z.object({
  name: z.string(),
  surname: z.string(),
  contact: z.string().optional(),
  email: z.string().email(),
  teacherType: z.enum(['COORDENADOR', 'DOCENTE', 'AUXILIAR']),
  statusTeacher: z.enum(['ATIVO', 'INATIVO']),
  loginId: z.string().optional(),
})

export const createTeacherSchema = teacherSchema

export const updateTeacherSchema = teacherSchema.partial()

export const teacherResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: teacherSchema,
})

export const teachersResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(teacherSchema),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type TeacherSchema = z.infer<typeof teacherSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
