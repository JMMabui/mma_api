import type { PaymentMethod } from '@prisma/client'
import { prismaClient } from '../../database/script'

interface CreatePaymentRequest {
  invoiceId: string
  amount: number
  paymentMethod: PaymentMethod,
  paymentDate: Date,
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
  async create({
    invoiceId,
    amount,
    paymentMethod,
    paymentDate,
    description,
    reference,
  }: CreatePaymentRequest) {
    return await prismaClient.payment.create({
      data: {
        invoiceId,
        amount,
        paymentMethod,
        paymentDate,
        reference,
        description,
      },
    })
  },

  async findAllPayments() {
    return await prismaClient.payment.findMany({
      include: {
        invoice: true,
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
