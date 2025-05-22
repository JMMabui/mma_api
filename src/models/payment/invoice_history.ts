import type { InvoiceStatus } from '@prisma/client'
import { prismaClient } from '../../database/script'

interface CreateInvoiceHistoryRequest {
  invoiceId: string
  status: InvoiceStatus
  description: string
  createdBy: string
}

export const InvoiceHistoryModel = {
  async create(data: CreateInvoiceHistoryRequest) {
    return await prismaClient.invoiceHistory.create({
      data: {
        invoiceId: data.invoiceId,
        status: data.status,
        description: data.description,
        createdBy: data.createdBy,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.invoiceHistory.findUnique({
      where: { id },
      // include: {
      //   invoice: true,
      // },
    })
  },

  async findByInvoiceId(invoiceId: string) {
    return await prismaClient.invoiceHistory.findMany({
      where: { invoiceId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.invoiceHistory.delete({
      where: { id },
    })
  },

  async getInvoiceHistory(invoiceId: string) {
    return await prismaClient.invoiceHistory.findMany({
      where: { invoiceId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async getLastStatus(invoiceId: string) {
    const history = await prismaClient.invoiceHistory.findMany({
      where: { invoiceId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    })
    return history[0]
  },
}
