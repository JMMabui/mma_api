import type { InvoiceStatus } from '@prisma/client'
import { prismaClient } from '../../database/script'

interface CreateLateFeeRequest {
  invoiceId: string
  amount: number
  daysLate: number
}

interface LateFee {
  id: string
  invoiceId: string
  amount: number
  daysLate: number
  appliedAt: Date
}

export const LateFeeModel = {
  async create(data: CreateLateFeeRequest) {
    return await prismaClient.lateFee.create({
      data: {
        invoiceId: data.invoiceId,
        amount: data.amount,
        daysLate: data.daysLate,
        appliedAt: new Date(),
      },
    })
  },

  async findAllLateFee() {
    return await prismaClient.lateFee.findMany({
      include: {
        invoice: true,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.lateFee.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    })
  },

  async findByInvoiceId(invoiceId: string) {
    return await prismaClient.lateFee.findMany({
      where: { invoiceId },
    })
  },

  async delete(id: string) {
    return await prismaClient.lateFee.delete({
      where: { id },
    })
  },

  async getTotalLateFees(invoiceId: string) {
    const lateFees = await prismaClient.lateFee.findMany({
      where: { invoiceId },
    })
    return lateFees.reduce(
      (total: number, fee: LateFee) => total + fee.amount,
      0
    )
  },

  async updatePaymentFee(lateFeeId: string, status: InvoiceStatus) {
    return await prismaClient.lateFee.update({
      where: { id: lateFeeId },
      data: {
        status,
        payedAt: new Date(),
      },
    })
  },

  async getLateFeeHistory(invoiceId: string) {
    return await prismaClient.lateFee.findMany({
      where: { invoiceId },
      orderBy: {
        appliedAt: 'desc',
      },
    })
  },
}
