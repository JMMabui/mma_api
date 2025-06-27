import { z } from 'zod'

const classCore = {
  name: z.string(),
  subjectId: z.string().uuid(),
  teacherId: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  schedule: z.string(),
  maxStudents: z.number().int().positive(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'CANCELLED']),
  description: z.string(),
}

export const classSchema = z.object({
  ...classCore,
})

export const createClassSchema = classSchema
export const updateClassSchema = classSchema.partial()

const classResponseCore = {
  id: z.string().uuid().optional(),
  ...classCore,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}

export const classResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(classResponseCore),
})

export const classesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(classResponseCore)),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type ClassSchema = z.infer<typeof classSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
