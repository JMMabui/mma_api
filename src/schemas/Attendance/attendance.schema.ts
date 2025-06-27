import { z } from 'zod'

const attendanceCore = {
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  date: z.date(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED']),
  justification: z.string().nullable(),
}

export const attendanceSchema = z.object({
  ...attendanceCore,
})

export const createAttendanceSchema = attendanceSchema
export const updateAttendanceSchema = attendanceSchema.partial()

const attendanceResponseCore = {
  id: z.string().uuid().optional(),
  ...attendanceCore,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}

export const attendanceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(attendanceResponseCore),
})

export const attendancesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(attendanceResponseCore)),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type AttendanceSchema = z.infer<typeof attendanceSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
