import { z } from 'zod'

const loginCore = {
  email: z.string().email(),
  password: z.string().min(6),
}

export const loginSchema = z.object({
  ...loginCore,
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

const loginResponseCore = {
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
  }),
}

export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(loginResponseCore),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
