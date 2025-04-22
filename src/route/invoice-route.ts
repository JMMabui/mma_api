import { InvoiceModel } from '../models/invoice'
import { z, ZodError } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../types/type'

export const InvoiceRoutes: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  // Create a new invoice
  app.post(
    '/invoice',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Create a new invoice',
        description: 'Create a new invoice for a student and course',
        body: z.object({
          studentId: z.string(),
          courseId: z.string(),
          type: z.enum([
            'MENSALIDADE',
            'MATRICULA',
            'PROPINA',
            'MATERIAL',
            'OUTROS',
          ]),
          amount: z.number().positive(),
          dueDate: z.string().datetime(),
          month: z
            .enum([
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
            .optional(),
          year: z.number().min(2000).max(2100).optional(),
        }),
      },
    },
    async (request, reply) => {
      const { studentId, courseId, type, amount, dueDate, month, year } =
        request.body
      try {
        const invoice = await InvoiceModel.create({
          studentId,
          courseId,
          type,
          amount,
          dueDate: new Date(dueDate),
          month,
          year,
        })

        return reply.code(201).send({
          success: true,
          message: 'Invoice created successfully',
          data: invoice,
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            success: false,
            message: 'Invalid request body',
            error: error.message,
          })
        }
        console.error('Error creating invoice:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error creating invoice',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  // Get all invoices
  app.get(
    '/invoice',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Get all invoices',
        description: 'Get all invoices',
      },
    },
    async (request, reply) => {
      try {
        const invoices = await InvoiceModel.findAll()
        if (!invoices) {
          return reply.code(404).send({
            success: false,
            message: 'No invoices found',
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Invoices retrieved successfully',
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
    async (request, reply) => {
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
    async (request, reply) => {
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
    async (request, reply) => {
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
  app.post(
    '/invoice/:id/payment',
    {
      schema: {
        tags: ['invoice'],
        summary: 'Add payment to invoice',
        description: 'Add a payment record to an invoice',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          amount: z.number().positive(),
          paymentMethod: z.enum([
            'DINHEIRO',
            'TRANSFERENCIA',
            'DEPOSITO',
            'CARTAO_CREDITO',
            'CARTAO_DEBITO',
            'OUTROS',
          ]),
          reference: z.string().optional(),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const payment = await InvoiceModel.addPayment(
          id,
          request.body.amount,
          request.body.paymentMethod,
          request.body.reference,
          request.body.description
        )

        return reply.code(201).send({
          success: true,
          message: 'Payment added successfully',
          data: payment,
        })
      } catch (error) {
        console.error('Error adding payment:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error adding payment',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

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
}
