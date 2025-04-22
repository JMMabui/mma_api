import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../types/type'
import { PaymentModel } from '../models/payment'

export const PaymentRoutes: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  app.post(
    '/payment',
    {
      schema: {
        tags: ['payment'],
        summary: 'Create a new payment',
        description: 'Create a new payment record',
        body: z.object({
          invoiceId: z.string(),
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
        const payment = await PaymentModel.create(request.body)
        return reply.code(201).send({
          success: true,
          message: 'Payment created successfully',
          data: payment,
        })
      } catch (error) {
        console.error('Error creating payment:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error creating payment',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/payment/:id',
    {
      schema: {
        tags: ['payment'],
        summary: 'Get payment by ID',
        description: 'Get detailed information about a specific payment',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const payment = await PaymentModel.findById(id)

        if (!payment) {
          return reply.code(404).send({
            success: false,
            message: 'Payment not found',
            data: null,
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Payment retrieved successfully',
          data: payment,
        })
      } catch (error) {
        console.error('Error retrieving payment:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving payment',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/payment/invoice/:invoiceId',
    {
      schema: {
        tags: ['payment'],
        summary: 'Get payments by invoice',
        description: 'Get all payments for a specific invoice',
        params: z.object({
          invoiceId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { invoiceId } = request.params
        const payments = await PaymentModel.findByInvoiceId(invoiceId)

        return reply.code(200).send({
          success: true,
          message: 'Payments retrieved successfully',
          data: payments,
        })
      } catch (error) {
        console.error('Error retrieving payments:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving payments',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
