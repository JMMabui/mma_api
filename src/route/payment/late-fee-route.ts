import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../../types/type'
import { LateFeeModel } from '../../models/payment/late_fee'

export const LateFeeRoutes: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  app.post(
    '/late-fee',
    {
      schema: {
        tags: ['late-fee'],
        summary: 'Create a new late fee',
        description: 'Create a new late fee record',
        body: z.object({
          invoiceId: z.string(),
          amount: z.number().positive(),
          daysLate: z.number().int().positive(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { invoiceId } = request.body
        const existing = await LateFeeModel.findByInvoiceId(invoiceId)
        if (existing) {
          return reply.code(400).send({
            success: false,
            message: 'Late fee already exists for this invoice.',
          })
        }

        const lateFee = await LateFeeModel.create(request.body)
        return reply.code(201).send({
          success: true,
          message: 'Late fee created successfully',
          data: lateFee,
        })
      } catch (error) {
        console.error('Error creating late fee:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error creating late fee',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/late-fee',
    {
      schema: {
        tags: ['late-fee'],
        summary: 'Get late fee by ID',
        description: 'Get detailed information about a specific late fee',
      },
    },
    async (request, reply) => {
      try {
        const lateFee = await LateFeeModel.findAllLateFee()

        if (!lateFee) {
          return reply.code(404).send({
            success: false,
            message: 'Late fee not found',
            data: null,
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Late fee retrieved successfully',
          data: lateFee,
        })
      } catch (error) {
        console.error('Error retrieving late fee:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving late fee',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/late-fee/:id',
    {
      schema: {
        tags: ['late-fee'],
        summary: 'Get late fee by ID',
        description: 'Get detailed information about a specific late fee',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const lateFee = await LateFeeModel.findById(id)

        if (!lateFee) {
          return reply.code(404).send({
            success: false,
            message: 'Late fee not found',
            data: null,
          })
        }

        return reply.code(200).send({
          success: true,
          message: 'Late fee retrieved successfully',
          data: lateFee,
        })
      } catch (error) {
        console.error('Error retrieving late fee:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving late fee',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/late-fee/invoice/:invoiceId',
    {
      schema: {
        tags: ['late-fee'],
        summary: 'Get late fees by invoice',
        description: 'Get all late fees for a specific invoice',
        params: z.object({
          invoiceId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { invoiceId } = request.params
        const lateFees = await LateFeeModel.findByInvoiceId(invoiceId)

        return reply.code(200).send({
          success: true,
          message: 'Late fees retrieved successfully',
          data: lateFees,
        })
      } catch (error) {
        console.error('Error retrieving late fees:', error)
        return reply.code(500).send({
          success: false,
          message: 'Error retrieving late fees',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
