import { z } from 'zod'

export const registrationSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  registrationDate: z.string().refine(
    date => {
      const today = new Date()
      const registrationDate = new Date(date)
      return registrationDate <= today
    },
    {
      message: 'Data de matrícula não pode ser futura',
    }
  ),
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
})

export const createRegistrationSchema = registrationSchema

export const updateRegistrationSchema = registrationSchema.partial()

export const registrationResponseSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  registrationDate: z.date(),
  status: z.enum([
    'PENDENTE',
    'CONFIRMADO',
    'CANCELADO',
    'TRANCADO',
    'INSCRITO',
    'NAO_INSCRITO',
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const registrationsResponseSchema = z.array(registrationResponseSchema)

export type RegistrationSchema = z.infer<typeof registrationSchema>
export type UpdateRegistrationSchema = z.infer<typeof updateRegistrationSchema>
