import dayjs from 'dayjs'
import { z } from 'zod'

export const lateFeeSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  daysLate: z.number().int().positive(),
  appliedAt: z.string().optional(),
  status: z
    .enum(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO', 'PARCIALMENTE_PAGO'])
    .default('PENDENTE'),
})

export const updateLateFeeSchema = lateFeeSchema.partial().extend({
  id: z.string(),
  paidAt: z.string().refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
    message: 'Data de expiração inválida',
  }),
})

export const lateFeeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: lateFeeSchema.partial().extend({
    id: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
})
export const lateFeeListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(
    lateFeeSchema.partial().extend({
      id: z.string(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
    })
  ),
})

export type LateFeeType = z.infer<typeof lateFeeSchema>
export type UpdateLateFeeType = z.infer<typeof updateLateFeeSchema>
