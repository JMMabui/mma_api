import { z } from 'zod'

export const paymentReminderSchema = z.object({
  invoiceId: z.string(),
  reminderType: z.string(),
  status: z.string(),
})

export const updatePaymentReminderSchema = paymentReminderSchema
  .partial()
  .extend({
    id: z.string(),
    status: z.string(),
    sentAt: z.string(),
  })

export const paymentReminderResponseSchema = z.object({
  success: z.boolean(), // corrigido de "sucess" para "success"
  message: z.string(),
  data: updatePaymentReminderSchema,
})

export type PaymentReminderType = z.infer<typeof paymentReminderSchema>
export type UpdatePaymentReminderType = z.infer<
  typeof updatePaymentReminderSchema
>
