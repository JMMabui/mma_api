import { z } from 'zod'

export const createPaymentSchema = z.object({
  amount: z.number().min(0),
  paymentDate: z.string().refine(date => !Number.isNaN(Date.parse(date)), {
    message: 'Data inválida',
  }),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER']),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).default('PENDING'),
  studentId: z.string(),
  description: z.string().optional(),
})

export const updatePaymentSchema = z.object({
  amount: z.number().min(0).optional(),
  paymentDate: z
    .string()
    .refine(date => !Number.isNaN(Date.parse(date)), {
      message: 'Data inválida',
    })
    .optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER']).optional(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
  description: z.string().optional(),
})

export const paymentResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    amount: z.number(),
    paymentDate: z.date(),
    paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER']),
    status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
    studentId: z.string(),
    description: z.string().nullable(),
    invoice: z.string(),
    student: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export const paymentsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      paymentDate: z.date(),
      paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER']),
      status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
      studentId: z.string(),
      description: z.string().nullable(),
      invoice: z.string(),
      student: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
})
