import { z } from 'zod'

export const paymentSchema = z.object({
  studentId: z.string().uuid(),
  amount: z.number().positive(),
  dueDate: z.date(),
  paymentDate: z.date().nullable(),
  type: z.enum(['MENSALIDADE', 'MATRICULA', 'OUTROS']),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']),
  description: z.string(),
  paymentMethod: z
    .enum(['CASH', 'TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD'])
    .nullable(),
  reference: z.string().nullable(),
})

export const createPaymentSchema = paymentSchema

export const updatePaymentSchema = paymentSchema.partial()

export const paymentResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: paymentSchema,
})

export const paymentsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(paymentSchema),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type PaymentSchema = z.infer<typeof paymentSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
