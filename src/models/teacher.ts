import type { TeacherType } from '@prisma/client'
import { prismaClient } from '../database/script'

interface Schema {
  fullName: string
  email: string
  contact: string
  profession: string
  type: TeacherType
}

export async function createTeacher({
  fullName,
  email,
  contact,
  profession,
  type,
}: Schema) {
  const teacher = await prismaClient.teacher.create({
    data: {
      fullName,
      email,
      contact,
      profession,
      type,
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

// Delete teacher by ID
export async function deleteTeacher(id: string) {
  const teacher = await prismaClient.teacher.delete({
    where: { id },
  })
  return teacher
}
