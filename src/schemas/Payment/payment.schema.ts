import { z } from 'zod'
import dayjs from 'dayjs'

const paymentCore = {
  invoiceId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.enum([
    'DINHEIRO',
    'TRANSFERENCIA',
    'DEPOSITO',
    'CARTAO_CREDITO',
    'CARTAO_DEBITO',
    'OUTROS',
  ]),
  paymentDate: z
    .string()
    .refine(
      date => {
        return dayjs(date, 'YYYY-MM-DD', true).isValid()
      },
      { message: 'Invalid date format for document expiration date' }
    )
    .transform(date => {
      return dayjs(date, 'YYYY-MM-DD').toDate()
    }),
  reference: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
}

export const createPaymentSchema = z.object({
  ...paymentCore,
})

export const updatePaymentSchema = z
  .object({
    ...paymentCore,
  })
  .partial()

const paymentResponseCore = {
  id: z.string(),
  ...paymentCore,
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const paymentResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object(paymentResponseCore),
})

export const paymentsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(z.object(paymentResponseCore)),
})

export const paymentParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreatePaymentType = z.infer<typeof createPaymentSchema>
export type UpdatePaymentType = z.infer<typeof updatePaymentSchema>
