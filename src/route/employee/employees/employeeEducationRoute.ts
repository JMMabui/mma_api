import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../../../types/type'
import z from 'zod'
import dayjs from 'dayjs'
import { employeeEducationModel } from '../../../models/employees/employeeEducation'

export const EmployeeEducationRoute: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance
) => {
  app.post(
    '/employee-education',
    {
      schema: {
        tags: ['employee_education'],
        summary: 'Create employee education data',
        description:
          'Create all data of employee with relationship with login data',
        body: z.object({
          employeerId: z.string().uuid(),
          institutionName: z.string(),
          degree: z.string(),
          fieldOfStudy: z.string(),
          startDate: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM').toDate()
            }),
          endDate: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM').toDate()
            }),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          employeerId,
          institutionName,
          degree,
          fieldOfStudy,
          startDate,
          endDate,
        } = request.body

        // Check if employee exists
        const employee = await employeeEducationModel.findById(employeerId)
        // if (!employee) {
        //   reply.status(404).send({
        //     success: false,
        //     message: 'Employee not found',
        //   })
        //   return
        // }

        // Create employee education
        const employeeEducation = await employeeEducationModel.create({
          employeerId,
          institutionName,
          degree,
          fieldOfStudy,
          startDate,
          endDate,
        })

        return reply.status(201).send({
          success: true,
          message: 'Employee education created successfully',
          data: employeeEducation,
        })
      } catch (error) {
        // Handle errors
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            message: 'Validation error',
            errors: error.errors,
          })
        }
        console.error(error)
        return reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  app.get(
    '/employee-education/:id',
    {
      schema: {
        tags: ['employee_education'],
        summary: 'Get employee education data by ID',
        description: 'Get employee education data by ID',
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        // Check if employee exists
        const employeeEducation = await employeeEducationModel.findById(id)
        if (!employeeEducation) {
          return reply.status(404).send({
            success: false,
            message: 'Employee education not found',
          })
        }

        return reply.status(200).send({
          success: true,
          message: 'Employee education found',
          data: employeeEducation,
        })
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  app.get(
    '/employee-education',
    {
      schema: {
        tags: ['employee_education'],
        summary: 'Get all employee education data',
        description: 'Get all employee education data',
      },
    },
    async (request, reply) => {
      try {
        const employeeEducation = await employeeEducationModel.findAll()
        if (!employeeEducation) {
          return reply.status(404).send({
            success: false,
            message: 'Employee education not found',
          })
        }

        return reply.status(200).send({
          success: true,
          message: 'Employee education found',
          data: employeeEducation,
        })
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  app.put(
    '/employee-education/:id',
    {
      schema: {
        tags: ['employee_education'],
        summary: 'Update employee education data',
        description: 'Update employee education data',
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          employeerId: z.string().uuid(),
          institutionName: z.string(),
          degree: z.string(),
          fieldOfStudy: z.string(),
          startDate: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM').toDate()
            }),
          endDate: z
            .string()
            .refine(
              date => {
                return dayjs(date, 'YYYY-MM', true).isValid()
              },
              { message: 'Invalid date format for document issued date' }
            )
            .transform(date => {
              return dayjs(date, 'YYYY-MM').toDate()
            }),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const {
          employeerId,
          institutionName,
          degree,
          fieldOfStudy,
          startDate,
          endDate,
        } = request.body

        // Check if employee exists
        const employeeEducation = await employeeEducationModel.findById(id)
        if (!employeeEducation) {
          return reply.status(404).send({
            success: false,
            message: 'Employee education not found',
          })
        }

        // Update employee education
        const updatedEmployeeEducation = await employeeEducationModel.update(
          id,
          {
            employeerId,
            institutionName,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
          }
        )

        return reply.status(200).send({
          success: true,
          message: 'Employee education updated successfully',
          data: updatedEmployeeEducation,
        })
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  app.delete(
    '/employee-education/:id',
    {
      schema: {
        tags: ['employee_education'],
        summary: 'Delete employee education data',
        description: 'Delete employee education data',
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        // Check if employee exists
        const employeeEducation = await employeeEducationModel.findById(id)
        if (!employeeEducation) {
          return reply.status(404).send({
            success: false,
            message: 'Employee education not found',
          })
        }

        // Delete employee education
        await employeeEducationModel.deleteById(id)

        return reply.status(200).send({
          success: true,
          message: 'Employee education deleted successfully',
        })
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )
}
