import { z } from 'zod'

export const createAssessmentResultSchema = z.object({
  assessmentId: z.string(),
  studentId: z.string(),
  score: z.number().min(0).max(20),
  feedback: z.string().optional(),
})

export const updateAssessmentResultSchema = z.object({
  score: z.number().min(0).max(20).optional(),
  feedback: z.string().optional(),
})

export const assessmentResultResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    assessmentId: z.string(),
    studentId: z.string(),
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
  }),
})

export const assessmentResultsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
      assessmentId: z.string(),
      studentId: z.string(),
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
    })
  ),
})
