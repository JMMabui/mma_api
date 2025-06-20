import { z } from 'zod'

export const createTeacherSubjectSchema = z.object({
  teacherId: z.string(),
  subjectId: z.string(),
})

export const updateTeacherSubjectSchema = z.object({
  teacherId: z.string().optional(),
  subjectId: z.string().optional(),
})

export const teacherSubjectResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      teacherId: z.string(),
      subjectId: z.string(),
      teacher: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        address: z.string(),
        birthDate: z.string(),
        gender: z.string(),
        role: z.string(),
      }),
      Subject: z.object({
        codigo: z.string(),
        subjectName: z.string(),
        year_study: z.string(),
        semester: z.string(),
        hcs: z.number(),
        credits: z.number(),
        subjectType: z.string(),
        courseId: z.string(),
      }),
    })
    .optional(),
})

export const teacherSubjectsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
      teacherId: z.string(),
      subjectId: z.string(),
      teacher: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        address: z.string(),
        birthDate: z.string(),
        gender: z.string(),
        role: z.string(),
      }),
      Subject: z.object({
        codigo: z.string(),
        subjectName: z.string(),
        year_study: z.string(),
        semester: z.string(),
        hcs: z.number(),
        credits: z.number(),
        subjectType: z.string(),
        courseId: z.string(),
      }),
    })
  ),
})
