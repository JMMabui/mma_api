import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    token: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
    }),
  }),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  contact: z.string().min(9),
  jobPosition: z.enum([
    'ADMIN_IT',
    'CTA_ADMIN_FINANCEIRO',
    'CTA_ADMIN_REG_ACADEMICO',
    'CTA_ADMIN_RH',
    'CTA_ADMIN_BIBLIOTECA',
    'CTA_ADMIN_COORDENADOR',
    'CTA_REG_ACADEMICO',
    'CTA_FINANCEIRO',
    'CTA_BIBLIOTECA',
    'CTA_DOCENTE',
    'CTA_RH',
    'CTA',
    'ESTUDANTE',
  ]),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
