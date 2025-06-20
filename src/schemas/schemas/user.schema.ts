import { z } from 'zod'

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})

export const createUserSchema = userSchema

export const updateUserSchema = userSchema.partial()

export const userResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: userSchema,
})

export const usersResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(userSchema),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type UserSchema = z.infer<typeof userSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
