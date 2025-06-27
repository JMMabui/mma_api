import z from 'zod'

const preInstitutoCore = {
  schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA']),
  schoolName: z.string(),
  schoolProvincy: z.enum([
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
  studentId: z.string(),
}

export const createPreInstitutoSchema = z.object({
  ...preInstitutoCore,
})

export const updatePreInstitutoSchema = z
  .object({
    ...preInstitutoCore,
  })
  .partial()

const preInstitutoResponseCore = {
  id: z.string(),
  ...preInstitutoCore,
}

export const preInstitutoResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(preInstitutoResponseCore).optional(),
})

export const preInstitutosResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(preInstitutoResponseCore)),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type CreatePreInstitutoType = z.infer<typeof createPreInstitutoSchema>
export type UpdatePreInstitutoType = z.infer<typeof updatePreInstitutoSchema>
