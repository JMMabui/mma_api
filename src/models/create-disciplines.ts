import type { DisciplineType, Semester, YearStudy } from '@prisma/client'
import { prismaClient } from '../database/script'

interface createDisciplinesRequest {
  codigo: string
  disciplineName: string
  year_study: YearStudy
  semester: Semester
  hcs: number
  credits: number
  disciplineType: DisciplineType
}

interface createSubjectsResponse extends createDisciplinesRequest {
  courseId: string
}

export async function createDiscipline({
  codigo,
  credits,
  disciplineName,
  disciplineType,
  hcs,
  semester,
  year_study,
}: createDisciplinesRequest) {
  const subject = await prismaClient.discipline.create({
    data: {
      codigo,
      credits,
      disciplineName,
      disciplineType,
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
  disciplineName,
  disciplineType,
  hcs,
  semester,
  year_study,
  courseId,
}: createSubjectsResponse) {
  const subject = await prismaClient.discipline.create({
    data: {
      codigo,
      credits,
      disciplineName,
      disciplineType,
      hcs,
      semester,
      year_study,
      courseId,
    },
  })

  return subject
}

export function findSubjectByCodigo(codigo: string) {
  return prismaClient.discipline.findFirst({
    where: {
      codigo,
    },
    include: {
      Course: true,
      StudentDiscipline: true,
    },
  })
}

export async function findSubjectsByCodigos(disciplineIds: string[]) {
  // Aqui você faz a busca das disciplinas no banco com base no array de IDs
  return await prismaClient.discipline.findMany({
    where: { codigo: { in: disciplineIds } },
  })
}

export async function getSubjectsByCourseId(courseId: string) {
  const subjects = await prismaClient.discipline.findMany({
    where: { courseId },
  })
  return subjects
}
