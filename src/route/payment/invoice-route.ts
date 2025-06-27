import { late, z, ZodError } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../../types/type'
import type { Month } from '@prisma/client'
import { getRegistrationByCourseId } from '../../models/students/registration'
import { InvoiceModel } from '../../models/payment/invoice'
import { LateFeeModel } from '../../models/payment/late_fee'

import type { FastifyRequest, FastifyReply } from 'fastify'
import {
  type CreateInvoiceType,
  type UpdateInvoiceType,
  createInvoiceSchema,
} from '../../schemas/Payment/invoice.schema'

// Função para calcular o valor da fatura com base no tipo, nível do curso e período
function calculateInvoiceAmount(
  type: string,
  levelCourse: string,
  period: string
): number {
  if (type !== 'MENSALIDADE') return 0

  const tabela: Record<string, Record<string, number>> = {
    LICENCIATURA: { LABORAL: 4500, POS_LABORAL: 5200 },
    MESTRADO: { LABORAL: 5500, POS_LABORAL: 6200 },
    TECNICO_MEDIO: { LABORAL: 3500, POS_LABORAL: 4200 },
    CURTA_DURACAO: { LABORAL: 2500, POS_LABORAL: 3200 },
    RELIGIOSO: { LABORAL: 1500, POS_LABORAL: 2200 },
  }

  const curso = tabela[levelCourse]
  if (!curso) return 0

  return curso[period] ?? 0
}

export const InvoiceRoutes: FastifyPluginAsyncZod = async app => {
  // Create a new invoice
  app.post(
    '/invoice',
    {
      // preHandler: [authenticate],
      schema: {
        tags: ['invoice'],
        summary: 'Criar nova fatura',
        description: 'Gera faturas para um estudante em um curso específico',

        body: createInvoiceSchema,
      },
    },
    async (
      request: FastifyRequest<{ Body: CreateInvoiceType }>,
      reply: FastifyReply
    ) => {
      try {
        const { studentId, courseId, type, dueDate, months, year } =
          request.body
        const invoiceYear = year ?? new Date().getFullYear()

        const registration = await getRegistrationByCourseId(courseId)
        if (!registration || registration.length === 0) {
          return reply.code(404).send({
            success: false,
            message: 'Registro do curso não encontrado',
          })
        }

        const { period, levelCourse } = registration[0].course

        const amount = calculateInvoiceAmount(type, levelCourse, period)

        // Verifica se já existem faturas para os meses selecionados
        for (const month of months) {
          const existingInvoice =
            await InvoiceModel.findByStudentIdCourseIdMonthYear(
              studentId,
              courseId,
              month,
              invoiceYear
            )
          if (existingInvoice) {
            return reply.code(409).send({
              success: false,
              message: `Fatura já existe para o mês ${month} de ${invoiceYear}`,
            })
          }
        }

        // Cria faturas para os meses selecionados
        const invoices = await Promise.all(
          months.map(month =>
            InvoiceModel.create({
              studentId,
              courseId,
              type,
              amount,
              dueDate: new Date(dueDate),
              month,
              year: invoiceYear,
            })
          )
        )

        return reply.code(201).send({
          success: true,
          message: 'Faturas criadas com sucesso',
          data: invoices,
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            success: false,
            message: 'Dados inválidos na requisição',
            error: error.errors,
          })
        }
        console.error('Erro ao criar faturas:', error)
        return reply.code(500).send({
          success: false,
          message: 'Erro interno ao criar faturas',
        })
      }
    }
  )

  // Get all invoices
  app.get(
    '/invoice',
    {
      // preHandler: [authenticate],
      schema: {
        tags: ['invoice'],
        summary: 'Get all invoices',
        description: 'Get all invoices',
      },
    },
    async (request, reply) => {
      try {
        const invoices = await InvoiceModel.findAll()

        const today = new Date()

        // 1. Filtrar faturas com status diferente de "PAGO" ou "CANCELADO"
        const pendingInvoices = invoices.filter(invoice => {
          return invoice.status !== 'PAGO' && invoice.status !== 'CANCELADO'
        })

        // 2. Mapear e calcular diferença de dias + 20% se vencido há mais de 10 dias
        const checkLateFeePossibility = pendingInvoices.map(invoice => {
          const dueDate = new Date(invoice.dueDate)
          const dayDiff = Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          let penalty = 0

          if (dayDiff > 0 && dayDiff <= 10) {
            penalty = invoice.amount * 0.2
          } else if (dayDiff > 10) {
            penalty = invoice.amount * 0.5
          }

          return {
            ...invoice,
            daysOverdue: dayDiff > 0 ? dayDiff : 0,
            penalty: Number.parseFloat(penalty.toFixed(2)),
          }
        })

        // 3. Atualizar status das faturas vencidas para "ATRASADO"
        const overdueInvoices = checkLateFeePossibility.filter(invoice => {
          return invoice.status !== 'PAGO' && invoice.daysOverdue > 0
        })
        for (const invoice of overdueInvoices) {
          await InvoiceModel.update(invoice.id, { status: 'ATRASADO' })
        }

        // 4. Criar multas apenas para invoices válidas e que ainda não possuem multa
        for (const invoice of checkLateFeePossibility) {
          if (invoice.penalty > 0) {
            await InvoiceModel.update(invoice.id, { status: 'ATRASADO' })
            const existing = await LateFeeModel.findByInvoiceId(invoice.id)
            if (
              !existing ||
              (Array.isArray(existing) && existing.length === 0)
            ) {
              await LateFeeModel.create({
                invoiceId: invoice.id,
                daysLate: invoice.daysOverdue,
                amount: invoice.penalty,
              })
            }
          }
        }

        return reply.code(200).send({
          success: true,
          message: 'Filtered invoices with overdue penalties',
          data: invoices,
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            success: false,
            message: 'Invalid request params',
            error: error.message,
          })
        }

        console.error('Error retrieving invoices:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving invoices',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // Get invoice by ID
  app.get(
    '/invoice/:id',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Get invoice by ID',
        description: 'Get detailed information about a specific invoice',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      try {
        const { id } = request.params
        const invoice = await InvoiceModel.findById(id)

        if (!invoice) {
          return reply.code(404).send({
            success: false,
            message: 'Invoice not found',
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Invoice retrieved successfully',
          data: invoice,
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            success: false,
            message: 'Invalid request params',
            error: error.message,
          })
        }
        console.error('Error retrieving invoice:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving invoice',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // Get invoices by student ID
  app.get(
    '/invoice/student/:studentId',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Get invoices by student ID',
        description: 'Get all invoices for a specific student',
        params: z.object({
          studentId: z.string(),
        }),
      },
    },
    async (
      request: FastifyRequest<{ Params: { studentId: string } }>,
      reply
    ) => {
      try {
        const { studentId } = request.params
        const invoices = await InvoiceModel.findByStudentId(studentId)

        return reply.code(200).send({
          success: true,
          message: 'Invoices retrieved successfully',
          data: invoices,
        })
      } catch (error) {
        console.error('Error retrieving invoices:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving invoices',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // Update invoice
  app.put(
    '/invoice/:id',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Update invoice',
        description: 'Update invoice information',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          status: z
            .enum([
              'PENDENTE',
              'PAGO',
              'ATRASADO',
              'CANCELADO',
              'PARCIALMENTE_PAGO',
            ])
            .optional(),
          amount: z.number().positive().optional(),
          dueDate: z.string().datetime().optional(),
          cancelledAt: z.string().datetime().optional(),
          cancelledBy: z.string().optional(),
          cancellationReason: z.string().optional(),
        }),
      },
    },
    async (
      request: FastifyRequest<{
        Params: { id: string }
        Body: UpdateInvoiceType
      }>,
      reply
    ) => {
      try {
        const { id } = request.params
        const updateData = {
          ...request.body,
          dueDate: request.body.dueDate
            ? new Date(request.body.dueDate)
            : undefined,
          cancelledAt: request.body.cancelledAt
            ? new Date(request.body.cancelledAt)
            : undefined,
          cancelledBy:
            request.body.cancelledBy === null
              ? undefined
              : request.body.cancelledBy,
          cancellationReason:
            request.body.cancellationReason === null
              ? undefined
              : request.body.cancellationReason,
        }

        const invoice = await InvoiceModel.update(id, updateData)

        return reply.code(200).send({
          success: true,
          message: 'Invoice updated successfully',
          data: invoice,
        })
      } catch (error) {
        console.error('Error updating invoice:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error updating invoice',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // Add payment to invoice
  // app.post(
  //   '/invoice/:id/payment',
  //   {
  //     schema: {
  //       tags: ['invoice'],
  //       summary: 'Add payment to invoice',
  //       description: 'Add a payment record to an invoice',
  //       params: z.object({
  //         id: z.string().uuid(),
  //       }),
  //       body: z.object({
  //         amount: z.number().positive(),
  //         paymentMethod: z.enum([
  //           'DINHEIRO',
  //           'TRANSFERENCIA',
  //           'DEPOSITO',
  //           'CARTAO_CREDITO',
  //           'CARTAO_DEBITO',
  //           'OUTROS',
  //         ]),
  //         reference: z.string().optional(),
  //         description: z.string().optional(),
  //       }),
  //     },
  //   },
  //   async (request: FastifyRequest<{Params:{id:string}, Body: }>, reply) => {
  //     try {
  //       const { id } = request.params

  //       const payment = await InvoiceModel.addPayment(
  //         id,
  //         request.body.amount,
  //         request.body.paymentMethod,
  //         request.body.reference,
  //         request.body.description
  //       )

  //       return reply.code(201).send({
  //         success: true,
  //         message: 'Payment added successfully',
  //         data: payment,
  //       })
  //     } catch (error) {
  //       console.error('Error adding payment:', error)
  //       return reply.code(500).send({
  //         success: false,
  //         message: 'Error adding payment',
  //         error: error instanceof Error ? error.message : 'Unknown error',
  //       })
  //     }
  //   }
  // )

  // Add late fee to invoice
  app.post(
    '/invoice/:id/late-fee',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Add late fee to invoice',
        description: 'Add a late fee to an invoice',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          amount: z.number().positive(),
          daysLate: z.number().int().positive(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const lateFee = await InvoiceModel.addLateFee(
          id,
          request.body.amount,
          request.body.daysLate
        )

        return reply.code(201).send({
          success: true,
          message: 'Late fee added successfully',
          data: lateFee,
        })
      } catch (error) {
        console.error('Error adding late fee:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error adding late fee',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // Add payment reminder
  app.post(
    '/invoice/:id/reminder',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Add payment reminder',
        description: 'Add a payment reminder for an invoice',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          reminderType: z.string(),
          status: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const reminder = await InvoiceModel.addPaymentReminder(
          id,
          request.body.reminderType,
          request.body.status
        )

        return reply.code(201).send({
          success: true,
          message: 'Payment reminder added successfully',
          data: reminder,
        })
      } catch (error) {
        console.error('Error adding payment reminder:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error adding payment reminder',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // delete invoice
  app.delete(
    '/invoice/:id',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Delete invoice',
        description: 'Delete an invoice',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        await InvoiceModel.delete(id)
        return reply.code(200).send({
          success: true,
          message: 'Invoice deleted successfully',
        })
      } catch (error) {
        console.error('Error deleting invoice:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error deleting invoice',
        })
      }
    }
  )

  app.delete(
    '/invoice',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Delete all invoices',
        description: 'Delete all invoices',
      },
    },
    async (request, reply) => {
      try {
        await InvoiceModel.deleteAll()
        return reply.code(200).send({
          success: true,
          message: 'All invoices deleted successfully',
        })
      } catch (error) {
        console.error('Error deleting all invoices:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error deleting all invoices',
        })
      }
    }
  )

  app.patch(
    '/invoices/:id/status',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Update invoice status',
        description: 'Update the status of an invoice',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          status: z.enum([
            'PENDENTE',
            'PAGO',
            'ATRASADO',
            'CANCELADO',
            'PARCIALMENTE_PAGO',
          ]),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { status } = request.body

        const invoice = await InvoiceModel.updateStatus(id, status)

        if (invoice.LateFee && invoice.LateFee.length > 0) {
          await Promise.all(
            invoice.LateFee.map(async lateFee => {
              const lateFeeRespnse = await LateFeeModel.updatePaymentFee(
                lateFee.id,
                status
              )
              console.log('Late fee updated successfully:', lateFeeRespnse)
            })
          )
        }

        return reply.code(200).send({
          success: true,
          message: 'Invoice status updated successfully',
          data: invoice,
        })
      } catch (error) {
        console.error('Error updating invoice status:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error updating invoice status',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
