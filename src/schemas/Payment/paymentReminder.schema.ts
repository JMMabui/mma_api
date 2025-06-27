import { z } from 'zod'

const paymentReminderCore = {
  invoiceId: z.string(),
  reminderType: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'OUTRO']),
  status: z.enum(['PENDENTE', 'ENVIADO', 'FALHOU']),
}

export const createPaymentReminderSchema = z.object({
  ...paymentReminderCore,
})

export const updatePaymentReminderSchema = z
  .object({
    ...paymentReminderCore,
    sentAt: z.string().datetime().optional().nullable(),
  })
  .partial()

const paymentReminderResponseCore = {
  id: z.string(),
  ...paymentReminderCore,
  sentAt: z.date().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const paymentReminderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(paymentReminderResponseCore),
})

export const paymentRemindersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(paymentReminderResponseCore)),
})

export const paymentReminderParamsSchema = z.object({
  id: z.string().uuid(),
})

export const paymentReminderParamsByInvoiceSchema = z.object({
  invoiceId: z.string().uuid(),
})

export type CreatePaymentReminderType = z.infer<
  typeof createPaymentReminderSchema
>
export type UpdatePaymentReminderType = z.infer<
  typeof updatePaymentReminderSchema
>
