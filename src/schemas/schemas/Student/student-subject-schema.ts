import { z } from 'zod'

export const createStudentSubjectSchema = z.object({
  studentId: z.string(),
  subjectId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REPROVED']).default('PENDING'),
  grade: z.number().min(0).max(20).optional(),
})

export const updateStudentSubjectSchema = z.object({
  studentId: z.string().optional(),
  subjectId: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REPROVED']).optional(),
  grade: z.number().min(0).max(20).optional(),
})

export const studentSubjectResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    studentId: z.string(),
    subjectId: z.string(),
    status: z.enum(['PENDING', 'APPROVED', 'REPROVED']),
    grade: z.number().min(0).max(20).optional(),
    student: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      address: z.string(),
      birthDate: z.date(),
      gender: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
    Subject: z.object({
      id: z.string(),
      codigo: z.string(),
      SubjectName: z.string(),
      year_study: z.number(),
      semester: z.number(),
      hcs: z.number(),
      credits: z.number(),
      SubjectType: z.string(),
      courseId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export const studentSubjectsResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
      studentId: z.string(),
      subjectId: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'REPROVED']),
      grade: z.number().min(0).max(20).optional(),
      student: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        address: z.string(),
        birthDate: z.date(),
        gender: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      Subject: z.object({
        id: z.string(),
        codigo: z.string(),
        SubjectName: z.string(),
        year_study: z.number(),
        semester: z.number(),
        hcs: z.number(),
        credits: z.number(),
        SubjectType: z.string(),
        courseId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
})
