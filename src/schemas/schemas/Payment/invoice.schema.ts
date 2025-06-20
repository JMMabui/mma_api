import { z } from 'zod'

export const invoiceSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  type: z.enum(['MENSALIDADE', 'MATRICULA', 'PROPINA', 'MATERIAL', 'OUTROS']),
  dueDate: z.string().datetime(),
  amount: z.number().min(0),
  months: z.array(
    z.enum([
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
  ),
  year: z.number().min(2000).max(2100).optional(),
})

export const updateInvoiceSchema = invoiceSchema.partial().extend({
  id: z.string(),
  cancelledAt: z.string().datetime().optional().nullable(),
  cancelledBy: z.string().optional().nullable(),
  cancellationReason: z.string().optional().nullable(),
})

export const invoiceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    studentId: z.string(),
    courseId: z.string(),
    type: z.enum(['MENSALIDADE', 'MATRICULA', 'PROPINA', 'MATERIAL', 'OUTROS']),
    dueDate: z.string().datetime(),
    months: z.array(
      z.enum([
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
    ),
    year: z.number().min(2000).max(2100).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
})
export const invoiceListResponseSchema = z.object({
  sucess: z.boolean(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      studentId: z.string(),
      courseId: z.string(),
      type: z.enum([
        'MENSALIDADE',
        'MATRICULA',
        'PROPINA',
        'MATERIAL',
        'OUTROS',
      ]),
      dueDate: z.string().datetime(),
      months: z.array(
        z.enum([
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
      ),
      year: z.number().min(2000).max(2100).optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
  ),
})

export type CreateInvoiceType = z.infer<typeof invoiceSchema>
export type UpdateInvoiceType = z.infer<typeof updateInvoiceSchema>
