import { z } from 'zod'

export const createStudentSubjectSchema = z.object({
  studentId: z.string(),
  subjectId: z.string(),
})

export const updateStudentSubjectSchema = z.object({
  status: z.enum(['INSCRITO', 'APROVADO', 'REPROVADO', 'CANCELADO']),
  result: z.enum(['EM_ANDAMENTO', 'APROVADO', 'REPROVADO']),
})

export const studentSubjectResponseSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  subjectId: z.string(),
  status: z.enum(['INSCRITO', 'APROVADO', 'REPROVADO', 'CANCELADO']),
  result: z.enum(['EM_ANDAMENTO', 'APROVADO', 'REPROVADO']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const studentSubjectsResponseSchema = z.array(
  studentSubjectResponseSchema
)

export type StudentSubjectSchema = z.infer<typeof createStudentSubjectSchema>
export type UpdateStudentSubjectSchema = z.infer<
  typeof updateStudentSubjectSchema
>
