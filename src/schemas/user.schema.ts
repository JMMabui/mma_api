import { z } from 'zod'

const userCore = {
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
}

export const userSchema = z.object({
  ...userCore,
})

export const createUserSchema = userSchema
export const updateUserSchema = userSchema.partial()

const userResponseCore = {
  id: z.string().optional(),
  ...userCore,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}

export const userResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(userResponseCore),
})

export const usersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(userResponseCore)),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type UserSchema = z.infer<typeof userSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
