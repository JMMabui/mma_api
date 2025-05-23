import { prismaClient } from '../../database/script'
import type {
  InvoiceType,
  InvoiceStatus,
  PaymentMethod,
  Month,
} from '../../../node_modules/.prisma/client/index.d'

interface CreateInvoiceRequest {
  studentId: string
  courseId: string
  type: InvoiceType
  amount: number
  dueDate: Date
  month: Month
  year: number
}

interface UpdateInvoiceRequest {
  status?: InvoiceStatus
  amount?: number
  dueDate?: Date
  cancelledAt?: Date
  cancelledBy?: string
  cancellationReason?: string
}

export const InvoiceModel = {
  async create({
    studentId,
    courseId,
    type,
    amount,
    dueDate,
    month,
    year,
  }: CreateInvoiceRequest) {
    return await prismaClient.invoice.create({
      data: {
        studentId,
        courseId,
        type,
        amount,
        dueDate,
        month,
        year,
      },
    })
  },

  async findAll() {
    return await prismaClient.invoice.findMany({
      include: {
        course: true,
        student: true,
        payments: true,
        LateFee: true,
        history: true,
        PaymentReminder: true,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.invoice.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
        payments: true,
        history: true,
        LateFee: true,
        PaymentReminder: true,
      },
    })
  },

  async findByStudentId(studentId: string) {
    return await prismaClient.invoice.findMany({
      where: { studentId },
      include: {
        course: true,
        payments: true,
        history: true,
        LateFee: true,
        PaymentReminder: true,
      },
    })
  },
  async findByCourseIdAndStudentId(courseId: string, studentId: string) {
    return await prismaClient.invoice.findMany({
      where: { courseId, studentId },
      include: {
        student: true,
        payments: true,
        history: true,
        LateFee: true,
        PaymentReminder: true,
      },
    })
  },

  async findByCourseIdAndStudentIdAndStatus(
    courseId: string,
    studentId: string,
    status: InvoiceStatus
  ) {
    return await prismaClient.invoice.findMany({
      where: { courseId, studentId, status },
      include: {
        student: true,
        payments: true,
        history: true,
        LateFee: true,
        PaymentReminder: true,
      },
    })
  },
  async findByStudentIdCourseIdMonthYear(
    studentId: string,
    courseId: string,
    month: Month,
    year: number
  ) {
    return await prismaClient.invoice.findFirst({
      where: {
        studentId,
        courseId,
        month,
        year,
      },
    })
  },
  // async findInvoice(
  //   studentId: string,
  //   courseId: string,
  //   month: Month,
  //   year: string
  // ) {
  //   return await prismaClient.invoice.findFirst({
  //     where: {
  //       studentId,
  //       courseId,
  //       month,
  //       year,
  //     },
  //   })
  // },

  async findByCourseId(courseId: string) {
    return await prismaClient.invoice.findMany({
      where: { courseId },
      include: {
        student: true,
        payments: true,
        history: true,
        LateFee: true,
        PaymentReminder: true,
      },
    })
  },

  async update(id: string, data: UpdateInvoiceRequest) {
    return await prismaClient.invoice.update({
      where: { id },
      data: {
        status: data.status,
        amount: data.amount,
        dueDate: data.dueDate,
        cancelledAt: data.cancelledAt,
        cancelledBy: data.cancelledBy,
        cancellationReason: data.cancellationReason,
      },
    })
  },

  async updateStatus(id: string, status: InvoiceStatus) {
    return await prismaClient.invoice.update({
      where: { id },
      data: { status },
      include: { LateFee: true },
    })
  },

  async deleteAll() {
    return await prismaClient.invoice.deleteMany()
  },

  async delete(id: string) {
    return await prismaClient.invoice.delete({
      where: { id },
    })
  },

  async addPayment(
    invoiceId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    reference?: string,
    description?: string
  ) {
    return await prismaClient.payment.create({
      data: {
        invoiceId,
        amount,
        paymentMethod,
        paymentDate: new Date(),
        reference,
        description,
      },
    })
  },

  async addHistory(
    invoiceId: string,
    status: InvoiceStatus,
    description: string,
    createdBy: string
  ) {
    return await prismaClient.invoiceHistory.create({
      data: {
        invoiceId,
        status,
        description,
        createdBy,
      },
    })
  },

  async addLateFee(invoiceId: string, amount: number, daysLate: number) {
    return await prismaClient.lateFee.create({
      data: {
        invoiceId,
        amount,
        daysLate,
        appliedAt: new Date(),
      },
    })
  },

  async addPaymentReminder(
    invoiceId: string,
    reminderType: string,
    status: string
  ) {
    return await prismaClient.paymentReminder.create({
      data: {
        invoiceId,
        sentAt: new Date(),
        reminderType,
        status,
      },
    })
  },
}
