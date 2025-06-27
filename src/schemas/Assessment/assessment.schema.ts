import { z } from 'zod'
import dayjs from 'dayjs'

const assessmentCore = {
  name: z.string(),
  assessmentType: z.enum([
    'TESTE_INDIVIDUAL',
    'TESTE_GRUPO',
    'TRABALHO_INDIVIDUAL',
    'TRABALHO_GRUPO',
    'EXAME_NORMAL',
    'EXAME_RECORRENCIA',
    'EXAME_ESPECIAL',
  ]),
  dateApplied: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for date of birth',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  weight: z
    .number()
    .refine(val => val >= 0, {
      message: 'Weight must be a positive number',
    })
    .refine(val => val <= 100, {
      message: 'Weight must not be greater than 100',
    }),
  subjectId: z.string(),
}

export const assessmentSchema = z.object({
  ...assessmentCore,
})

export const createAssessmentSchema = assessmentSchema
export const updateAssessmentSchema = assessmentSchema.partial()

const assessmentResponseCore = {
  id: z.string().optional(),
  ...assessmentCore,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}

export const assessmentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(assessmentResponseCore),
})

export const assessmentsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(assessmentResponseCore)),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type AssessmentSchema = z.infer<typeof assessmentSchema>
export type CreateAssessmentSchema = z.infer<typeof createAssessmentSchema>
export type UpdateAssessmentSchema = z.infer<typeof updateAssessmentSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
