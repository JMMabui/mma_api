import { prismaClient } from '../database/script'

interface CreatePaymentReminderRequest {
  invoiceId: string
  reminderType: string
  status: string
}

export const PaymentReminderModel = {
  async create(data: CreatePaymentReminderRequest) {
    return await prismaClient.paymentReminder.create({
      data: {
        invoiceId: data.invoiceId,
        sentAt: new Date(),
        reminderType: data.reminderType,
        status: data.status,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.paymentReminder.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    })
  },

  async findByInvoiceId(invoiceId: string) {
    return await prismaClient.paymentReminder.findMany({
      where: { invoiceId },
      orderBy: {
        sentAt: 'desc',
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.paymentReminder.delete({
      where: { id },
    })
  },

  async getReminderHistory(invoiceId: string) {
    return await prismaClient.paymentReminder.findMany({
      where: { invoiceId },
      orderBy: {
        sentAt: 'desc',
      },
    })
  },

  async getLastReminder(invoiceId: string) {
    const reminders = await prismaClient.paymentReminder.findMany({
      where: { invoiceId },
      orderBy: {
        sentAt: 'desc',
      },
      take: 1,
    })
    return reminders[0]
  },
}
