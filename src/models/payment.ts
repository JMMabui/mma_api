import type { PaymentMethod } from '@prisma/client'
import { prismaClient } from '../database/script'

interface CreatePaymentRequest {
  invoiceId: string
  amount: number
  paymentMethod: PaymentMethod
  reference: string | null
  description: string | null
}

interface UpdatePaymentRequest {
  amount?: number
  paymentMethod?: PaymentMethod
  reference?: string
  description?: string
}

interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: Date
  reference: string | null
  description: string | null
}

export const PaymentModel = {
  async create(data: CreatePaymentRequest) {
    return await prismaClient.payment.create({
      data: {
        invoiceId: data.invoiceId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: new Date(),
        reference: data.reference,
        description: data.description,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.payment.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    })
  },

  async findByInvoiceId(invoiceId: string) {
    return await prismaClient.payment.findMany({
      where: { invoiceId },
      orderBy: {
        paymentDate: 'desc',
      },
    })
  },

  async update(id: string, data: UpdatePaymentRequest) {
    return await prismaClient.payment.update({
      where: { id },
      data: {
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        reference: data.reference,
        description: data.description,
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.payment.delete({
      where: { id },
    })
  },

  async getTotalPaid(invoiceId: string) {
    const payments = await prismaClient.payment.findMany({
      where: { invoiceId },
    })
    return payments.reduce(
      (total: number, payment: Payment) => total + payment.amount,
      0
    )
  },

  async getPaymentHistory(invoiceId: string) {
    return await prismaClient.payment.findMany({
      where: { invoiceId },
      orderBy: {
        paymentDate: 'desc',
      },
    })
  },
}
