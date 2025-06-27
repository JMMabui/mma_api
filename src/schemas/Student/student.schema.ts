import { z } from 'zod'
import dayjs from 'dayjs'

const dateSchema = z
  .string()
  .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
    message: 'Invalid date format for document issued date',
  })
  .transform(date => dayjs(date, 'YYYY-MM-DD').toDate())

const studentCore = {
  surname: z.string().min(1, { message: 'Apelido é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  dataOfBirth: dateSchema,
  placeOfBirth: z
    .string()
    .min(1, { message: 'Local de nascimento é obrigatório' }),
  gender: z.enum(['MASCULINO', 'FEMININO']),
  maritalStatus: z.enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO']),
  provincyAddress: z.enum([
    'MAPUTO_CIDADE',
    'MAPUTO_PROVINCIA',
    'GAZA',
    'INHAMBANE',
    'MANICA',
    'SOFALA',
    'TETE',
    'ZAMBEZIA',
    'NAMPULA',
    'CABO_DELGADO',
    'NIASSA',
  ]),
  documentType: z.enum(['BI', 'PASSAPORTE']),
  documentNumber: z.string().min(1),
  documentIssuedAt: dateSchema,
  documentExpiredAt: dateSchema,
  nuit: z
    .number()
    .refine(val => Number.isInteger(val) && val.toString().length === 9, {
      message: 'NUIT deve ter exatamente 9 dígitos',
    }),
  address: z.string().min(1),
  fatherName: z.string().min(1),
  motherName: z.string().min(1),
}

export const studentSchema = z.object({
  ...studentCore,
})

export const studentWithLoginSchema = studentSchema.extend({
  loginId: z.string(),
})

export const updateStudentSchema = studentSchema.partial()

const studentResponseCore = {
  id: z.string(),
  ...studentCore,
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const studentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(studentResponseCore),
})

export const studentsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.object(studentResponseCore)),
})

export type CreateStudentType = z.infer<typeof studentSchema>
export type UpdateStudentType = z.infer<typeof updateStudentSchema>
