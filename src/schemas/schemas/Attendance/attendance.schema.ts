import { z } from 'zod'

export const attendanceSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  date: z.date(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED']),
  justification: z.string().nullable(),
})

export const createAttendanceSchema = attendanceSchema

export const updateAttendanceSchema = attendanceSchema.partial()

export const attendanceResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: attendanceSchema,
})

export const attendancesResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(attendanceSchema),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type AttendanceSchema = z.infer<typeof attendanceSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
