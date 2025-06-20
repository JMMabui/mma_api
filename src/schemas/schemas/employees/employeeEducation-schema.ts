import { z } from 'zod'
import dayjs from 'dayjs'

export const createEmployeeEducationSchema = z.object({
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
})

export const updateEmployeeEducationSchema = createEmployeeEducationSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  })
export const employeeEducationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string().uuid(),
    employeerId: z.string().uuid(),
    institutionName: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})
export const employeeEducationListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
      employeerId: z.string().uuid(),
      institutionName: z.string(),
      degree: z.string(),
      fieldOfStudy: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
})

export type CreateEmployeeEducationType = z.infer<
  typeof createEmployeeEducationSchema
>
export type UpdateEmployeeEducationType = z.infer<
  typeof updateEmployeeEducationSchema
>
