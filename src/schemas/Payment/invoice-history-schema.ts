import { z } from 'zod'

const invoiceHistoryCore = {
  invoiceId: z.string(),
  status: z.enum([
    'PENDENTE',
    'PAGO',
    'ATRASADO',
    'CANCELADO',
    'PARCIALMENTE_PAGO',
  ]),
  description: z.string(),
  createdBy: z.string(),
}

export const createInvoiceHistorySchema = z.object({
  ...invoiceHistoryCore,
})

export const updateInvoiceHistorySchema = z
  .object({
    ...invoiceHistoryCore,
    status: z
      .enum(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO', 'PARCIALMENTE_PAGO'])
      .optional(),
    description: z.string().optional(),
    createdBy: z.string().optional(),
    cancelledAt: z.string().datetime().optional().nullable(),
    cancelledBy: z.string().optional().nullable(),
    cancellationReason: z.string().optional().nullable(),
  })
  .partial()

const invoiceHistoryResponseCore = {
  id: z.string().uuid(),
  ...invoiceHistoryCore,
  status: z.enum([
    'PENDENTE',
    'PAGO',
    'ATRASADO',
    'CANCELADO',
    'PARCIALMENTE_PAGO',
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const invoiceHistoryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(invoiceHistoryResponseCore),
})

export const invoiceHistoriesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(invoiceHistoryResponseCore)),
})

export const invoiceHistoryParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateInvoiceHistoryType = z.infer<
  typeof createInvoiceHistorySchema
>
export type UpdateInvoiceHistoryType = z.infer<
  typeof updateInvoiceHistorySchema
>
