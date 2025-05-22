import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../../types/type'
import z, { date } from 'zod'
import dayjs from 'dayjs'
import { employeeModel } from '../../models/employees/employee'
import { userModel } from '../../models/user'
import { findLoginByEmail, findLoginById } from '../../models/login'

export const EmployeeRoute: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/employee',
    {
      schema: {
        tags: ['employee'],
        summary: 'Create employee data',
        description:
          'Create all data of employee with relationship with login data',
        body: z.object({
          userId: z.string().uuid(),
          employeeType: z.enum([
            'PERMANENT',
            'FIXED_TERM',
            'UNCERTAIN_TERM',
            'PART_TIME',
            'INTERN',
            'APPRENTICE',
          ]),
          jobTitle: z.string(),
          department: z.string(),
          dateOfHire: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          salary: z.number().positive(),
          loginId: z.string().uuid(),
          status: z.enum(['ATIVO', 'INATIVO']),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          userId,
          employeeType,
          jobTitle,
          department,
          dateOfHire,
          salary,
          loginId,
          status,
        } = request.body

        // Validate the userId and loginId against the database if necessary
        const userExists = await userModel.findById(userId)
        if (!userExists) {
          return reply.status(404).send({
            message: 'User not found',
          })
        }
        const loginExists = await findLoginById(loginId)
        if (!loginExists) {
          return reply.status(404).send({
            message: 'Login not found',
          })
        }
        // Check if the user is already an employee
        const existingEmployee = await employeeModel.findById(userId)
        if (existingEmployee) {
          return reply.status(400).send({
            message: 'User is already an employee',
          })
        }

        // Create the employee
        // If the user is not an employee, create a new employee record
        const employee = await employeeModel.create({
          userId,
          employeeType,
          jobTitle,
          department,
          dateOfHire,
          salary,
          loginId,
          status,
        })
        if (!employee) {
          return reply.status(500).send({
            message: 'Failed to create employee',
          })
        }
        // Return the created employee data
        return reply.status(201).send({
          sucess: true,
          message: 'Employee created successfully',
          data: employee,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Validation error',
            details: error.errors,
          })
        }
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.get(
    '/employee',
    {
      schema: {
        tags: ['employee'],
        summary: 'Get all employee data',
        description: 'Get all employee data',
      },
    },
    async (request, reply) => {
      try {
        const employees = await employeeModel.findAll()
        if (!employees) {
          return reply.status(404).send('Employee not found')
        }

        return reply
          .status(200)
          .send({ sucess: true, message: 'Employee found', data: employees })
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
    '/employee/email/:email',
    {
      schema: {
        tags: ['employee'],
        summary: 'Get employee data by login id',
        description: 'Get employee data login id',
        params: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      // console.log('api iniciado')
      try {
        const { email } = request.params

        const login = await findLoginByEmail(email)
        const loginId = login?.id

        if (!loginId) {
          return reply.status(404).send('Login not found')
        }

        const employee = await employeeModel.findByLoginId(loginId)
        if (!employee) {
          return reply.status(404).send('Employee not found')
        }

        return reply
          .status(200)
          .send({ sucess: true, message: 'Employee found', data: employee })
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
    '/employee/:id',
    {
      schema: {
        tags: ['employee'],
        summary: 'Get employee data by id',
        description: 'Get employee data by id',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const employee = await employeeModel.findById(id)
        if (!employee) {
          return reply.status(404).send('Employee not found')
        }

        return reply
          .status(200)
          .send({ sucess: true, message: 'Employee found', data: employee })
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
    '/employee/login/:loginId',
    {
      schema: {
        tags: ['employee'],
        summary: 'Get employee data by login id',
        description: 'Get employee data login id',
        params: z.object({
          loginId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      console.log('api iniciado')
      try {
        const { loginId } = request.params
        const employee = await employeeModel.findByLoginId(loginId)
        if (!employee) {
          return reply.status(404).send('Employee not found')
        }

        return reply
          .status(200)
          .send({ sucess: true, message: 'Employee found', data: employee })
      } catch (error) {
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.put(
    '/employee/:id',
    {
      schema: {
        tags: ['employee'],
        summary: 'Update employee data',
        description: 'Update employee data',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          userId: z.string().uuid(),
          employeeType: z.enum([
            'PERMANENT',
            'FIXED_TERM',
            'UNCERTAIN_TERM',
            'PART_TIME',
            'INTERN',
            'APPRENTICE',
          ]),
          jobTitle: z.string(),
          department: z.string(),
          dateOfHire: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM-DD', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM-DD').toDate()
            }),
          salary: z.number().positive(),
          loginId: z.string().uuid(),
          status: z.enum(['ATIVO', 'INATIVO']).optional(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const {
          userId,
          employeeType,
          jobTitle,
          department,
          dateOfHire,
          salary,
          loginId,
          status,
        } = request.body

        // Validate the userId and loginId against the database if necessary
        const userExists = await userModel.findById(userId)
        if (!userExists) {
          return reply.status(404).send({
            message: 'User not found',
          })
        }
        const loginExists = await findLoginById(loginId)
        if (!loginExists) {
          return reply.status(404).send({
            message: 'Login not found',
          })
        }

        // Update the employee
        const updatedEmployee = await employeeModel.update({
          id,
          userId,
          employeeType,
          jobTitle,
          department,
          dateOfHire,
          salary,
          loginId,
          status,
        })
        if (!updatedEmployee) {
          return reply.status(500).send({
            message: 'Failed to update employee',
          })
        }

        // Return the updated employee data
        return reply.status(200).send({
          sucess: true,
          message: 'Employee updated successfully',
          data: updatedEmployee,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Validation error',
            details: error.errors,
          })
        }
        console.error('Error creating employee:', error)
        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.delete(
    '/employee/:id',
    {
      schema: {
        tags: ['employee'],
        summary: 'Delete employee data',
        description: 'Delete employee data',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const deletedEmployee = await employeeModel.findById(id)
        if (!deletedEmployee) {
          return reply.status(404).send('Employee not found')
        }

        const deleteEmployee = await employeeModel.deleteById(id)
        if (!deleteEmployee) {
          return reply.status(500).send({
            message: 'Failed to delete employee',
          })
        }
        // Return the deleted employee data

        return reply.status(200).send({
          sucess: true,
          message: 'Employee deleted successfully',
          data: deleteEmployee,
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
