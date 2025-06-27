import dayjs from 'dayjs'
import { z } from 'zod'

const lateFeeCore = {
  invoiceId: z.string(),
  amount: z.number().positive(),
  daysLate: z.number().int().positive(),
}

export const createLateFeeSchema = z.object({
  ...lateFeeCore,
})

export const updateLateFeeSchema = z
  .object({
    ...lateFeeCore,
    paidAt: z.string().datetime().optional().nullable(),
  })
  .partial()

const lateFeeResponseCore = {
  id: z.string(),
  ...lateFeeCore,
  paidAt: z.date().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const lateFeeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(lateFeeResponseCore),
})

export const lateFeesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(lateFeeResponseCore)),
})

export const lateFeeParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateLateFeeType = z.infer<typeof createLateFeeSchema>
export type UpdateLateFeeType = z.infer<typeof updateLateFeeSchema>
