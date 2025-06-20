import { z } from 'zod'

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        path: z.array(z.string()).optional(),
      })
    )
    .optional(),
})

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>

export const createErrorResponse = (
  message: string,
  errors?: Array<{ message: string; path?: string[] }>
) => ({
  success: false,
  message,
  ...(errors && { errors }),
})

export const createSuccessResponse = <T>(message: string, data: T) => ({
  success: true,
  message,
  data,
})
