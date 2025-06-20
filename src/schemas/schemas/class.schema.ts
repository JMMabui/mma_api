import { z } from 'zod'

export const classSchema = z.object({
  name: z.string(),
  subjectId: z.string().uuid(),
  teacherId: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  schedule: z.string(),
  maxStudents: z.number().int().positive(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'CANCELLED']),
  description: z.string(),
})

export const createClassSchema = classSchema

export const updateClassSchema = classSchema.partial()

export const classResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: classSchema,
})

export const classesResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(classSchema),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type ClassSchema = z.infer<typeof classSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
