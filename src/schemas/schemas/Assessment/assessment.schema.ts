import { z } from 'zod'
import dayjs from 'dayjs'

export const assessmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  assessmentType: z
    .enum([
      'TESTE_INDIVIDUAL',
      'TESTE_GRUPO',
      'TRABALHO_INDIVIDUAL',
      'TRABALHO_GRUPO',
      'EXAME_NORMAL',
      'EXAME_RECORRENCIA',
      'EXAME_ESPECIAL',
    ])
    .describe('Type of assessment')
    .refine(
      value =>
        [
          'TESTE_INDIVIDUAL',
          'TESTE_GRUPO',
          'TRABALHO_INDIVIDUAL',
          'TRABALHO_GRUPO',
          'EXAME_NORMAL',
          'EXAME_RECORRENCIA',
          'EXAME_ESPECIAL',
        ].includes(value),
      {
        message: 'Invalid assessment type',
      }
    ),
  dateApplied: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format. Expected: YYYY-MM-DD',
    })
    .transform(date => dayjs(date).toDate()),
  weight: z
    .number()
    .min(0, 'Weight must be a positive number')
    .max(100, 'Weight must not exceed 100'),
  subjectId: z.string().min(1, 'Subject ID is required'),
})

export const createAssessmentSchema = assessmentSchema

export const updateAssessmentSchema = assessmentSchema.partial()

export const assessmentResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: assessmentSchema,
})

export const assessmentsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(assessmentSchema),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type AssessmentSchema = z.infer<typeof assessmentSchema>
export type CreateAssessmentSchema = z.infer<typeof createAssessmentSchema>
export type UpdateAssessmentSchema = z.infer<typeof updateAssessmentSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
