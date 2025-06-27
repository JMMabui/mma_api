import { z } from 'zod'

const teacherCore = {
  surname: z.string().min(1, 'surname is required'),
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  contact: z.string(),
  teacherType: z.enum(['COORDENADOR', 'DOCENTE', 'AUXILIAR']),
  statusTeacher: z.enum(['ATIVO', 'INATIVO']),
  loginId: z.string().nullable().optional(),
}

export const createTeacherSchema = z.object({
  ...teacherCore,
})

export const updateTeacherSchema = z
  .object({
    ...teacherCore,
  })
  .partial()

const teacherResponseCore = {
  id: z.string(),
  ...teacherCore,
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const teacherResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(teacherResponseCore),
})

export const teachersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(teacherResponseCore)),
})

export type CreateTeacherSchema = z.infer<typeof createTeacherSchema>
export type UpdateTeacherSchema = z.infer<typeof updateTeacherSchema>
