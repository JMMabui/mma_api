import { z } from 'zod'
import dayjs from 'dayjs'

const employeeCore = {
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
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for document issued date',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  salary: z.number().positive(),
  loginId: z.string().uuid(),
  status: z.enum(['ATIVO', 'INATIVO']),
}

export const createEmployeeSchema = z.object({
  ...employeeCore,
})

export const updateEmployeeSchema = z
  .object({
    ...employeeCore,
  })
  .partial()

const employeeResponseCore = {
  id: z.string(),
  ...employeeCore,
  dateOfHire: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const employeeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(employeeResponseCore),
})

export const employeesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(employeeResponseCore)),
})

export const employeeParamsSchema = z.object({
  id: z.string().uuid(),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z
    .array(z.object({ message: z.string(), path: z.array(z.string()) }))
    .optional(),
})

export type CreateEmployeeType = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeType = z.infer<typeof updateEmployeeSchema>
