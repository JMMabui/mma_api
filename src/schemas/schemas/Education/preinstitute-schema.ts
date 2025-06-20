import z from 'zod'

export const createPreInstitutoSchema = z.object({
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
})

export const updatePreInstitutoSchema = z.object({
  schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA']).optional(),
  schoolName: z.string().optional(),
  schoolProvincy: z
    .enum([
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
    ])
    .optional(),
  studentId: z.string().optional(),
})

export const preInstitutoResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      schoolLevel: z.string(),
      schoolName: z.string(),
      schoolProvincy: z.string(),
      studentId: z.string(),
    })
    .optional(),
})

export const preInstitutosResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
      schoolLevel: z.string(),
      schoolName: z.string(),
      schoolProvincy: z.string(),
      studentId: z.string(),
    })
  ),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type CreatePreInstitutoType = z.infer<typeof createPreInstitutoSchema>
export type UpdatePreInstitutoType = z.infer<typeof updatePreInstitutoSchema>
