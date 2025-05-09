import z from 'zod'
import type { FastifyTypeInstance } from '../../types/type'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { employeeModel } from '../../models/employees/employee'
import { employeeBankModel } from '../../models/employees/employeeBank'

export const EmployeeBankRoute: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  app.post(
    '/employee-bank',
    {
      schema: {
        tags: ['employee_bank'],
        summary: 'Create employee bank data',
        description:
          'Create all data of employee with relationship with login data',
        body: z.object({
          employeerId: z.string().uuid(),
          bankName: z.string(),
          accountNumber: z.string(),
          accountType: z.string(),
          accountHolder: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          employeerId,
          bankName,
          accountNumber,
          accountType,
          accountHolder,
        } = request.body

        // Check if employee exists
        const employee = await employeeModel.findById(employeerId)

        // Create employee bank data
        const employeeBankData = await employeeBankModel.create({
          employeerId,
          bankName,
          accountNumber,
          accountType,
          accountHolder,
        })

        reply.code(201).send({
          success: true,
          message: 'Employee bank data created successfully',
          employeeBankData,
        })
      } catch (error) {
        // Handle error
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            message: 'Validation error',
            details: error.errors,
          })
        }
        console.error(error)
        reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )

  app.get(
    '/employee-bank',
    {
      schema: {
        tags: ['employee_bank'],
        summary: 'Get all employee bank data',
        description: 'Get all employee bank data',
      },
    },
    async (request, reply) => {
      try {
        const employeeBankData = await employeeBankModel.findAll()
        if (!employeeBankData) {
          return reply.status(404).send('Employee bank data not found')
        }

        return reply.status(200).send({
          sucess: true,
          message: 'Employee bank data found',
          data: employeeBankData,
        })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/employee-bank/:id',
    {
      schema: {
        tags: ['employee_bank'],
        summary: 'Get employee bank data by ID',
        description: 'Get employee bank data by ID',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        // Check if employee exists
        const employeeBankData = await employeeBankModel.findById(id)
        if (!employeeBankData) {
          return reply.status(404).send({
            success: false,
            message: 'Employee bank data not found',
          })
        }

        return reply.status(200).send({
          success: true,
          message: 'Employee bank data found',
          data: employeeBankData,
        })
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  app.put(
    '/employee-bank/:id',
    {
      schema: {
        tags: ['employee_bank'],
        summary: 'Update employee bank data',
        description: 'Update employee bank data',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          employeerId: z.string().uuid(),
          bankName: z.string(),
          accountNumber: z.string(),
          accountType: z.string(),
          accountHolder: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const {
          employeerId,
          bankName,
          accountNumber,
          accountType,
          accountHolder,
        } = request.body

        // Check if employee exists
        const employee = await employeeModel.findById(employeerId)

        if (!employee) {
          return reply
            .status(404)
            .send({ sucess: false, message: 'Employee not found' })
        }

        // Update employee bank data
        const employeeBankData = await employeeBankModel.update(id, {
          employeerId,
          bankName,
          accountNumber,
          accountType,
          accountHolder,
        })

        reply.code(200).send({
          success: true,
          message: 'Employee bank data updated successfully',
          employeeBankData,
        })
      } catch (error) {
        // Handle error
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            message: 'Validation error',
            details: error.errors,
          })
        }
        console.error(error)
        reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )

  app.delete(
    '/employee-bank/:id',
    {
      schema: {
        tags: ['employee_bank'],
        summary: 'Delete employee bank data',
        description: 'Delete employee bank data',
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        // Check if employee exists
        const employeeBankData = await employeeBankModel.findById(id)
        if (!employeeBankData) {
          return reply.status(404).send({
            success: false,
            message: 'Employee bank data not found',
          })
        }
        // Delete employee bank data
        const deletedEmployeeBankData = await employeeBankModel.deleteById(id)
        if (!deletedEmployeeBankData) {
          return reply.status(500).send({
            message: 'Failed to delete employee bank data',
          })
        }
        // Return the deleted employee bank data
        return reply.status(200).send({
          sucess: true,
          message: 'Employee bank data deleted successfully',
          data: deletedEmployeeBankData,
        })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
