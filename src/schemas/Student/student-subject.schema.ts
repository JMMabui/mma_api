import { z } from 'zod'

const studentSubjectCore = {
  studentId: z.string(),
  subjectId: z.string(),
  status: z.enum(['INSCRITO', 'APROVADO', 'REPROVADO', 'CANCELADO']).optional(),
  result: z.enum(['EM_ANDAMENTO', 'APROVADO', 'REPROVADO']).optional(),
}

export const createStudentSubjectSchema = z.object({
  studentId: studentSubjectCore.studentId,
  subjectId: studentSubjectCore.subjectId,
})

export const updateStudentSubjectSchema = z.object({
  status: studentSubjectCore.status,
  result: studentSubjectCore.result,
})

const studentSubjectResponseCore = {
  id: z.string(),
  ...studentSubjectCore,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}

export const studentSubjectResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(studentSubjectResponseCore),
})

export const studentSubjectsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(studentSubjectResponseCore)),
})

export type StudentSubjectSchema = z.infer<typeof createStudentSubjectSchema>
export type UpdateStudentSubjectSchema = z.infer<
  typeof updateStudentSubjectSchema
>
