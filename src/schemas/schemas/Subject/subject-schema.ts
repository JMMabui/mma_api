import { z } from 'zod'

export const createSubjectSchema = z.object({
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
})

export const updateSubjectSchema = z.object({
  SubjectName: z.string().optional(),
  year_study: z
    .enum(['PRIMEIRO_ANO', 'SEGUNDO_ANO', 'TERCEIRO_ANO', 'QUARTO_ANO'])
    .optional(),
  semester: z.enum(['PRIMEIRO_SEMESTRE', 'SEGUNDO_SEMESTRE']).optional(),
  hcs: z.number().optional(),
  credits: z.number().optional(),
  SubjectType: z.enum(['COMPLEMENTAR', 'NUCLEAR']).optional(),
  courseId: z.string().optional(),
})

export const subjectResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z
    .object({
      codigo: z.string(),
      SubjectName: z.string(),
      year_study: z.string(),
      semester: z.string(),
      hcs: z.number(),
      credits: z.number(),
      SubjectType: z.string(),
      courseId: z.string(),
    })
    .optional(),
})

export const subjectsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      codigo: z.string(),
      SubjectName: z.string(),
      year_study: z.string(),
      semester: z.string(),
      hcs: z.number(),
      credits: z.number(),
      SubjectType: z.string(),
      courseId: z.string(),
    })
  ),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})
export type CreateSubjectSchema = z.infer<typeof createSubjectSchema>
export type UpdateSubjectSchema = z.infer<typeof updateSubjectSchema>
export type SubjectResponseSchema = z.infer<typeof subjectResponseSchema>
export type SubjectsResponseSchema = z.infer<typeof subjectsResponseSchema>
