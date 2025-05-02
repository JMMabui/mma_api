import type { StatusTeacher, TeacherType } from '@prisma/client'
import { prismaClient } from '../database/script'

interface Schema {
  surname: string
  name: string
  email: string
  contact: string
  teacherType: TeacherType
  statusTeacher: StatusTeacher
  loginId: string
}

export async function createTeacher({
  surname,
  name,
  email,
  contact,
  teacherType,
  statusTeacher,
  loginId,
}: Schema) {
  const teacher = await prismaClient.teacher.create({
    data: {
      surname,
      name,
      email,
      contact,
      teacherType,
      statusTeacher,
      loginId,
    },
  })
  return teacher
}

export async function listAllTeacher() {
  const teachers = await prismaClient.teacher.findMany()
  return teachers
}

// Update teacher's data
export async function updateTeacher(id: string, data: Partial<Schema>) {
  const teacher = await prismaClient.teacher.update({
    where: { id },
    data: { ...data },
  })
  return teacher
}

// Get teacher by ID
export async function getTeacherById(id: string) {
  const teacher = await prismaClient.teacher.findUnique({
    where: { id },
  })
  return teacher
}

export async function getTeacherByEmail(email: string) {
  const teacher = await prismaClient.teacher.findUnique({
    where: { email },
  })
  return teacher
}

// Delete teacher by ID
export async function deleteTeacher(id: string) {
  const teacher = await prismaClient.teacher.delete({
    where: { id },
  })
  return teacher
}
