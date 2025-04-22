import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../types/type'
import { InvoiceHistoryModel } from '../models/invoice_history'

export const InvoiceHistoryRoutes: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  app.post(
    '/invoice-history',
    {
      schema: {
        tags: ['invoice-history'],
        summary: 'Create a new invoice history record',
        description: 'Create a new history record for an invoice',
        body: z.object({
          invoiceId: z.string(),
          status: z.enum([
            'PENDENTE',
            'PAGO',
            'ATRASADO',
            'CANCELADO',
            'PARCIALMENTE_PAGO',
          ]),
          description: z.string(),
          createdBy: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const history = await InvoiceHistoryModel.create(request.body)
        return reply.code(201).send({
          success: true,
          message: 'Invoice history created successfully',
          data: history,
        })
      } catch (error) {
        console.error('Error creating invoice history:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error creating invoice history',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/invoice-history/:id',
    {
      schema: {
        tags: ['invoice-history'],
        summary: 'Get invoice history by ID',
        description:
          'Get detailed information about a specific invoice history record',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const history = await InvoiceHistoryModel.findById(id)

        if (!history) {
          return reply.code(404).send({
            success: false,
            message: 'Invoice history not found',
            data: null,
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Invoice history retrieved successfully',
          data: history,
        })
      } catch (error) {
        console.error('Error retrieving invoice history:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving invoice history',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/invoice-history/invoice/:invoiceId',
    {
      schema: {
        tags: ['invoice-history'],
        summary: 'Get invoice history by invoice',
        description: 'Get all history records for a specific invoice',
        params: z.object({
          invoiceId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { invoiceId } = request.params
        const history = await InvoiceHistoryModel.findByInvoiceId(invoiceId)

        return reply.code(200).send({
          success: true,
          message: 'Invoice history retrieved successfully',
          data: history,
        })
      } catch (error) {
        console.error('Error retrieving invoice history:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving invoice history',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/invoice-history/invoice/:invoiceId/last',
    {
      schema: {
        tags: ['invoice-history'],
        summary: 'Get last invoice history record',
        description:
          'Get the most recent history record for a specific invoice',
        params: z.object({
          invoiceId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { invoiceId } = request.params
        const lastStatus = await InvoiceHistoryModel.getLastStatus(invoiceId)

        if (!lastStatus) {
          return reply.code(404).send({
            success: false,
            message: 'No history records found for this invoice',
            data: null,
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Last invoice history retrieved successfully',
          data: lastStatus,
        })
      } catch (error) {
        console.error('Error retrieving last invoice history:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving last invoice history',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
