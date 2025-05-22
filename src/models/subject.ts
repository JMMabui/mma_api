import type { Semester, YearStudy, SubjectType } from '@prisma/client'
import { prismaClient } from '../database/script'

interface createDisciplinesRequest {
  codigo: string
  subjectName: string
  year_study: YearStudy
  semester: Semester
  hcs: number
  credits: number
  subjectType: SubjectType
}

interface createSubjectsResponse extends createDisciplinesRequest {
  courseId: string
}

export async function createDiscipline({
  codigo,
  credits,
  subjectName,
  subjectType,
  hcs,
  semester,
  year_study,
}: createDisciplinesRequest) {
  const subject = await prismaClient.subject.create({
    data: {
      codigo,
      credits,
      subjectName,
      subjectType,
      hcs,
      semester,
      year_study,
    },
  })

  return subject
}

export async function createSubjects({
  codigo,
  credits,
  subjectName,
  subjectType,
  hcs,
  semester,
  year_study,
  courseId,
}: createSubjectsResponse) {
  const subject = await prismaClient.subject.create({
    data: {
      codigo,
      credits,
      subjectName,
      subjectType,
      hcs,
      semester,
      year_study,
      courseId,
    },
  })

  return subject
}

export async function getAllSubjects() {
  const subjects = await prismaClient.subject.findMany({
    include: {
      Course: true,
      StudentSubject: true,
    },
  })
  return subjects
}

export function findSubjectByCodigo(codigo: string) {
  return prismaClient.subject.findFirst({
    where: {
      codigo,
    },
    include: {
      Course: true,
      StudentSubject: true,
    },
  })
}

export async function findSubjectsByCodigos(disciplineIds: string[]) {
  // Aqui você faz a busca das disciplinas no banco com base no array de IDs
  return await prismaClient.subject.findMany({
    where: { codigo: { in: disciplineIds } },
  })
}

export async function getSubjectsByCourseId(courseId: string) {
  const subjects = await prismaClient.subject.findMany({
    where: { courseId },
  })
  return subjects
}
