import dayjs from 'dayjs'
import { z } from 'zod'

const educationOfficerCore = {
  fullName: z.string(),
  profession: z.string(),
  dataOfBirth: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Formato de data inválido. Esperado: YYYY-MM-DD',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  email: z.string().email(),
  contact: z.string(),
  provincyAddress: z.enum([
    'MAPUTO_CIDADE',
    'MAPUTO_PROVINCIA',
    'GAZA',
    'INHAMBANE',
    'MANICA',
    'SOFALA',
    'TETE',
    'ZAMBEZIA',
    'NAMPULA',
    'CABO_DELGADO',
    'NIASSA',
  ]),
  address: z.string(),
}

export const educationOfficerSchema = z.object({
  ...educationOfficerCore,
})

export const createEducationOfficerSchema = educationOfficerSchema
export const updateEducationOfficerSchema = educationOfficerSchema.partial()

const educationOfficerResponseCore = {
  id: z.string().optional(),
  ...educationOfficerCore,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}

export const educationOfficerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(educationOfficerResponseCore),
})

export const educationOfficersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(educationOfficerResponseCore)),
})

export type EducationOfficerSchema = z.infer<typeof educationOfficerSchema>
export type CreateEducationOfficerSchema = z.infer<
  typeof createEducationOfficerSchema
>
export type UpdateEducationOfficerSchema = z.infer<
  typeof updateEducationOfficerSchema
>
export type EducationOfficerResponseSchema = z.infer<
  typeof educationOfficerResponseSchema
>
