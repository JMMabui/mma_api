import { z } from 'zod'

const assessmentResultCore = {
  assessmentId: z.string(),
  studentId: z.string(),
  score: z.number().min(0).max(20),
  feedback: z.string().optional(),
}

export const createAssessmentResultSchema = z.object({
  ...assessmentResultCore,
})

export const updateAssessmentResultSchema = z.object({
  score: z.number().min(0).max(20).optional(),
  feedback: z.string().optional(),
})

const assessmentResultResponseCore = {
  id: z.string(),
  ...assessmentResultCore,
  grade: z.number().min(0).max(20),
  feedback: z.string().nullable(),
  assessment: z.object({
    id: z.string(),
    title: z.string(),
    dateApplied: z.date(),
    weight: z.number(),
    subjectId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  student: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const assessmentResultResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(assessmentResultResponseCore),
})

export const assessmentResultsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(assessmentResultResponseCore)),
})

export type CreateAssessmentResultSchema = z.infer<
  typeof createAssessmentResultSchema
>
export type UpdateAssessmentResultSchema = z.infer<
  typeof updateAssessmentResultSchema
>
