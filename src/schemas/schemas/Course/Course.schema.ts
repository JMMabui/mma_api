import { z } from 'zod'

export const createCourseSchema = z.object({
  courseName: z
    .string()
    .min(3, 'Nome do curso deve ter no mínimo 3 caracteres'),
  courseDuration: z.number().min(1, 'Duração do curso deve ser maior que 0'),
  courseDescription: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  levelCourse: z.enum([
    'CURTA_DURACAO',
    'TECNICO_MEDIO',
    'LICENCIATURA',
    'MESTRADO',
    'RELIGIOSO',
  ]),
  period: z.enum(['LABORAL', 'POS_LABORAL']),
  totalVacancies: z.number().min(1, 'Total de vagas deve ser maior que 0'),
  availableVacancies: z
    .number()
    .min(0, 'Vagas disponíveis não podem ser negativas'),
})

export const courseResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    courseName: z.string(),
    courseDescription: z.string(),
    courseDuration: z.number(),
    levelCourse: z.string(),
    period: z.string(),
    totalVacancies: z.number(),
    availableVacancies: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export const courseWithStudentsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    courseName: z.string(),
    levelCourse: z.string(),
    period: z.string(),
    Registration: z.array(
      z.object({
        student: z.object({
          id: z.string(),
          name: z.string(),
          surname: z.string(),
          email: z.string().optional(),
          phone: z.string().optional(),
          dataOfBirth: z.date().optional(),
          placeOfBirth: z.string().optional(),
          gender: z.string().optional(),
          maritalStatus: z.string().optional(),
        }),
      })
    ),
  }),
  countStudentRegistration: z.number(),
})

export type CourseSchema = z.infer<typeof createCourseSchema>
