import { prismaClient } from '../database/script'

interface Schema {
  teacher_id: string
  disciplineId: string
}

export async function createTeacherSubject({
  teacher_id,
  disciplineId,
}: Schema) {
  const teacher_subject = await prismaClient.teacherDiscipline.create({
    data: {
      teacher_id,
      disciplineId,
    },
  })

  return teacher_subject
}

export async function listAllTeacherSubject() {
  const teacher_subjects = await prismaClient.teacherDiscipline.findMany({
    select: {
      id: true,
      teacher_id: true,
      disciplineId: true,
      discipline: {
        select: {
          codigo: true,
          disciplineName: true,
          year_study: true,
          semester: true,
          hcs: true,
          credits: true,
          disciplineType: true,
        },
      },
      teacher: {
        select: {
          fullName: true,
          email: true,
          contact: true,
          profession: true,
          type: true,
        },
      },
    },
  })

  return teacher_subjects
}

export async function getTeacherSubjectById(id: string) {
  const teacher_subject = await prismaClient.teacherDiscipline.findUnique({
    where: { id },
  })
  return teacher_subject
}

export async function getTeacherSubjectByTeacherId(teacher_id: string) {
  const teacher_subject = await prismaClient.teacherDiscipline.findMany({
    where: { teacher_id },
    include: {
      discipline: {},
      teacher: {},
    },
  })
  return teacher_subject
}

export async function deleteTeacherSubject(id: string) {
  const teacher_subject = await prismaClient.teacherDiscipline.delete({
    where: { id },
  })
  return teacher_subject
}

// Update teacher's data
export async function updateTeacherSubject(id: string, data: Partial<Schema>) {
  const teacher_subject = await prismaClient.teacherDiscipline.update({
    where: { id },
    data: { ...data },
  })
  return teacher_subject
}
