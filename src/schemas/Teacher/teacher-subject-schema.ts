import { z } from 'zod'

const teacherSubjectCore = {
  teacherId: z.string(),
  subjectId: z.string(),
}

export const createTeacherSubjectSchema = z.object({
  ...teacherSubjectCore,
})

export const updateTeacherSubjectSchema = z
  .object({
    ...teacherSubjectCore,
  })
  .partial()

const teacherSubjectResponseCore = {
  id: z.string(),
  ...teacherSubjectCore,
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
}

export const teacherSubjectResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(teacherSubjectResponseCore).optional(),
})

export const teacherSubjectsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(teacherSubjectResponseCore)),
})

export type CreateTeacherSubjectSchema = z.infer<
  typeof createTeacherSubjectSchema
>
export type UpdateTeacherSubjectSchema = z.infer<
  typeof updateTeacherSubjectSchema
>
