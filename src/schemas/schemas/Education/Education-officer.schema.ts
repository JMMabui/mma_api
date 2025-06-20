import dayjs from 'dayjs'
import { z } from 'zod'

export const EducationOfficerSchema = z.object({
  fullName: z.string(),
  profession: z.string(),
  dataOfBirth: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Formato de data inválido. Esperado: YYYY-MM-DD',
    }),
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
})

export const updateEducationOfficerSchema = EducationOfficerSchema.partial()

export const educationOfficerResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: EducationOfficerSchema,
})

export const educationOfficersResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(EducationOfficerSchema),
})

export type EducationOfficerSchema = z.infer<typeof EducationOfficerSchema>
export type CreateEducationOfficerSchema = z.infer<
  typeof EducationOfficerSchema
>
export type UpdateEducationOfficerSchema = z.infer<
  typeof updateEducationOfficerSchema
>
export type EducationOfficerResponseSchema = z.infer<
  typeof educationOfficerResponseSchema
>
