import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../types/type'
import { PaymentReminderModel } from '../models/payment_reminder'

export const PaymentReminderRoutes: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  app.post(
    '/payment-reminder',
    {
      schema: {
        tags: ['payment-reminder'],
        summary: 'Create a new payment reminder',
        description: 'Create a new payment reminder record',
        body: z.object({
          invoiceId: z.string(),
          reminderType: z.string(),
          status: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const reminder = await PaymentReminderModel.create(request.body)
        return reply.code(201).send({
          success: true,
          message: 'Payment reminder created successfully',
          data: reminder,
        })
      } catch (error) {
        console.error('Error creating payment reminder:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error creating payment reminder',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/payment-reminder/:id',
    {
      schema: {
        tags: ['payment-reminder'],
        summary: 'Get payment reminder by ID',
        description:
          'Get detailed information about a specific payment reminder',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const reminder = await PaymentReminderModel.findById(id)

        if (!reminder) {
          return reply.code(404).send({
            success: false,
            message: 'Payment reminder not found',
            data: null,
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Payment reminder retrieved successfully',
          data: reminder,
        })
      } catch (error) {
        console.error('Error retrieving payment reminder:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving payment reminder',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/payment-reminder/invoice/:invoiceId',
    {
      schema: {
        tags: ['payment-reminder'],
        summary: 'Get payment reminders by invoice',
        description: 'Get all payment reminders for a specific invoice',
        params: z.object({
          invoiceId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { invoiceId } = request.params
        const reminders = await PaymentReminderModel.findByInvoiceId(invoiceId)

        return reply.code(200).send({
          success: true,
          message: 'Payment reminders retrieved successfully',
          data: reminders,
        })
      } catch (error) {
        console.error('Error retrieving payment reminders:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving payment reminders',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
