import { z } from 'zod'
import dayjs from 'dayjs'

export const createEmployeeSchema = z.object({
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
})

export const EmployeeResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    id: z.string(),
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
    dateOfHire: z.date(),
    salary: z.number().positive(),
    loginId: z.string().uuid(),
    status: z.enum(['ATIVO', 'INATIVO']),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export const EmployeesResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
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
      dateOfHire: z.date(),
      salary: z.number().positive(),
      loginId: z.string().uuid(),
      status: z.enum(['ATIVO', 'INATIVO']),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
})

export const updateEmployeeSchema = z.object({
  userId: z.string().uuid().optional(),
  employeeType: z
    .enum([
      'PERMANENT',
      'FIXED_TERM',
      'UNCERTAIN_TERM',
      'PART_TIME',
      'INTERN',
      'APPRENTICE',
    ])
    .optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
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
    })
    .optional(),
  salary: z.number().positive().optional(),
  loginId: z.string().uuid().optional(),
  status: z.enum(['ATIVO', 'INATIVO']).optional(),
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
