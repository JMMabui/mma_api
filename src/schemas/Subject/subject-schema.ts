import { z } from 'zod'

const subjectCore = {
  codigo: z.string(),
  SubjectName: z.string(),
  year_study: z.enum([
    'PRIMEIRO_ANO',
    'SEGUNDO_ANO',
    'TERCEIRO_ANO',
    'QUARTO_ANO',
  ]),
  semester: z.enum(['PRIMEIRO_SEMESTRE', 'SEGUNDO_SEMESTRE']),
  hcs: z.number(),
  credits: z.number(),
  SubjectType: z.enum(['COMPLEMENTAR', 'NUCLEAR']),
  courseId: z.string(),
}

export const createSubjectSchema = z.object({
  ...subjectCore,
})

export const updateSubjectSchema = z
  .object({
    ...subjectCore,
  })
  .partial()

const subjectResponseCore = {
  id: z.string().optional(),
  ...subjectCore,
}

export const subjectResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(subjectResponseCore).optional(),
})

export const subjectsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(subjectResponseCore)),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type CreateSubjectSchema = z.infer<typeof createSubjectSchema>
export type UpdateSubjectSchema = z.infer<typeof updateSubjectSchema>
export type SubjectResponseSchema = z.infer<typeof subjectResponseSchema>
export type SubjectsResponseSchema = z.infer<typeof subjectsResponseSchema>
