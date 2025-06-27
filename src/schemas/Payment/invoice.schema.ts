import { z } from 'zod'

const monthEnum = z.enum([
      'JANEIRO',
      'FEVEREIRO',
      'MARCO',
      'ABRIL',
      'MAIO',
      'JUNHO',
      'JULHO',
      'AGOSTO',
      'SETEMBRO',
      'OUTUBRO',
      'NOVEMBRO',
      'DEZEMBRO',
    ])

const invoiceCore = {
  studentId: z.string(),
  courseId: z.string(),
  type: z.enum(['MENSALIDADE', 'MATRICULA', 'PROPINA', 'MATERIAL', 'OUTROS']),
  dueDate: z.string().datetime(),
  amount: z.number().min(0),
  months: z.array(monthEnum),
  year: z.number().min(2000).max(2100).optional(),
}

export const createInvoiceSchema = z.object({
  ...invoiceCore,
})

export const updateInvoiceSchema = z
  .object({
    ...invoiceCore,
    status: z
      .enum(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO', 'PARCIALMENTE_PAGO'])
      .optional(),
  cancelledAt: z.string().datetime().optional().nullable(),
  cancelledBy: z.string().optional().nullable(),
  cancellationReason: z.string().optional().nullable(),
})
  .partial()

const invoiceResponseCore = {
  id: z.string(),
  ...invoiceCore,
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

export const invoiceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(invoiceResponseCore),
})

export const invoicesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(invoiceResponseCore)),
})

export const invoiceParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateInvoiceType = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceType = z.infer<typeof updateInvoiceSchema>