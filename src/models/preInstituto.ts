import type { PreLevel, ProvincyAddress } from '@prisma/client'
import { prismaClient } from '../database/script'

interface preInstitutoRequest {
  schoolLevel: PreLevel
  schoolName: string
  schoolProvincy: ProvincyAddress
  student_id: string
}

export async function createdPreInstituto({
  schoolLevel,
  schoolName,
  schoolProvincy,
  student_id,
}: preInstitutoRequest) {
  const data = await prismaClient.preSchool.create({
    data: {
      schoolLevel,
      schoolName,
      schoolProvincy,
      student_id,
    },
  })

  return data
}

export async function listAllPreInstitutos() {
  const data = await prismaClient.preSchool.findMany()
  return data
}

export async function getPreInstitutoById(id: string) {
  const data = await prismaClient.preSchool.findUnique({
    where: {
      id,
    },
  })
  return data
}

export async function getPreInstitutoByStudentId(student_id: string) {
  const data = await prismaClient.preSchool.findMany({
    where: {
      student_id,
    },
  })
  return data
}

export async function updatePreInstituto(
  id: string,
  schoolLevel: PreLevel,
  schoolName: string,
  schoolProvincy: ProvincyAddress,
  student_id: string
) {
  const data = await prismaClient.preSchool.update({
    where: {
      id,
    },
    data: {
      schoolLevel,
      schoolName,
      schoolProvincy,
      student_id,
    },
  })
  return data
}

export async function deletePreInstituto(id: string) {
  const data = await prismaClient.preSchool.delete({
    where: {
      id,
    },
  })
  return data
}
