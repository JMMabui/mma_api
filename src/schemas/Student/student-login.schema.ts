import { z } from 'zod'
import dayjs from 'dayjs'

const studentLoginCore = {
  surname: z.string(),
  name: z.string(),
  dataOfBirth: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for date of birth',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  placeOfBirth: z.string(),
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
  address: z.string(),
  fatherName: z.string(),
  motherName: z.string(),
  documentType: z.enum(['BI', 'PASSAPORTE']),
  documentNumber: z.string(),
  documentIssuedAt: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for document issued date',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  documentExpiredAt: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for document expiration date',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  nuit: z.number().refine(nuit => nuit.toString().length === 9, {
    message: 'O NUIT deve ter exatamente 9 dígitos',
  }),
  email: z.string().email(),
  password: z.string().min(8),
  contact: z.string().min(9),
}

export const studentLoginSchema = z.object({
  ...studentLoginCore,
})

const studentLoginResponseCore = {
  student: z.object({
    id: z.string(),
    surname: z.string(),
    name: z.string(),
    dataOfBirth: z.date(),
    placeOfBirth: z.string(),
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
    address: z.string(),
    fatherName: z.string(),
    motherName: z.string(),
    documentType: z.enum(['BI', 'PASSAPORTE']),
    documentNumber: z.string(),
    documentIssuedAt: z.date(),
    documentExpiredAt: z.date(),
    nuit: z.number(),
    loginId: z.string(),
  }),
  login: z.object({
    id: z.string(),
    email: z.string(),
    contact: z.string(),
    jobPosition: z.string(),
    createdAt: z.string(),
  }),
}

export const studentLoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(studentLoginResponseCore),
})

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

export type StudentLoginSchema = z.infer<typeof studentLoginSchema>
export type StudentLoginResponseSchema = z.infer<
  typeof studentLoginResponseSchema
>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
