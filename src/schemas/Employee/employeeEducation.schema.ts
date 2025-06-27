import { z } from 'zod'
import dayjs from 'dayjs'

const employeeEducationCore = {
  employeerId: z.string().uuid(),
  institutionName: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startDate: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM', true).isValid(), {
      message: 'Invalid date format for startDate',
    })
    .transform(date => dayjs(date, 'YYYY-MM').toDate()),
  endDate: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM', true).isValid(), {
      message: 'Invalid date format for endDate',
    })
    .transform(date => dayjs(date, 'YYYY-MM').toDate()),
}

export const createEmployeeEducationSchema = z.object({
  ...employeeEducationCore,
})

export const updateEmployeeEducationSchema = z
  .object({
    ...employeeEducationCore,
    id: z.string().uuid().optional(),
  })
  .partial()

const employeeEducationResponseCore = {
  id: z.string().uuid(),
  ...employeeEducationCore,
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const employeeEducationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(employeeEducationResponseCore),
})

export const employeeEducationListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(employeeEducationResponseCore)),
})

export type CreateEmployeeEducationType = z.infer<
  typeof createEmployeeEducationSchema
>
export type UpdateEmployeeEducationType = z.infer<
  typeof updateEmployeeEducationSchema
>
