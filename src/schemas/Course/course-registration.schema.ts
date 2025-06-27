import { z } from 'zod'

const courseCore = {
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
}

export const courseSchema = z.object({
  ...courseCore,
})

const registrationCore = {
  studentId: z.string(),
  courseId: z.string(),
  registrationDate: z.string().datetime(),
  status: z
    .enum([
      'PENDENTE',
      'CONFIRMADO',
      'CANCELADO',
      'TRANCADO',
      'INSCRITO',
      'NAO_INSCRITO',
    ])
    .default('PENDENTE'),
}

export const registrationSchema = z.object({
  ...registrationCore,
})

export const createRegistrationSchema = registrationSchema
export const updateRegistrationSchema = registrationSchema.partial()

const registrationResponseCore = {
  id: z.string(),
  ...registrationCore,
  registrationDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const registrationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(registrationResponseCore),
})

export const registrationsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(registrationResponseCore)),
})

export type RegistrationSchema = z.infer<typeof registrationSchema>
export type UpdateRegistrationSchema = z.infer<typeof updateRegistrationSchema>
