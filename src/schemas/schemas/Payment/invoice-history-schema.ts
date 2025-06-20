import { z } from 'zod'

export const createInvoiceHistorySchema = z.object({
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
})

export const updateInvoiceHistorySchema = createInvoiceHistorySchema
  .partial()
  .extend({
    id: z.string().uuid(),
  })
export const invoiceHistoryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string().uuid(),
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
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})
export const invoiceHistoryListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
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
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
})
export type CreateInvoiceHistoryType = z.infer<
  typeof createInvoiceHistorySchema
>
export type UpdateInvoiceHistoryType = z.infer<
  typeof updateInvoiceHistorySchema
>
