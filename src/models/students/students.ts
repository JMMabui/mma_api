import type {
  Gender,
  MaritalStatus,
  ProvincyAddress,
  DocumentType,
} from '@prisma/client'
import { prismaClient } from '../../database/script'

interface studentRequest {
  // Gerado através de uma função que gera um id único de acordo com os requisitos
  id: string
  surname: string
  name: string
  dataOfBirth: Date
  placeOfBirth: string
  gender: Gender
  maritalStatus: MaritalStatus
  provincyAddress: ProvincyAddress
  address: string
  fatherName: string
  motherName: string
  documentType: DocumentType
  documentNumber: string
  documentIssuedAt: Date
  documentExpiredAt: Date
  nuit: number
  loginId: string | null
}

export async function createStudents({
  id,
  surname,
  name,
  dataOfBirth,
  placeOfBirth,
  gender,
  maritalStatus,
  provincyAddress,
  address,
  fatherName,
  motherName,
  documentType,
  documentNumber,
  documentIssuedAt,
  documentExpiredAt,
  nuit,
  loginId,
}: studentRequest) {
  try {
    const student = await prismaClient.student.create({
      data: {
        id,
        surname,
        name,
        dataOfBirth,
        placeOfBirth,
        gender,
        maritalStatus,
        provincyAddress,
        address,
        fatherName,
        motherName,
        documentType,
        documentNumber,
        documentIssuedAt,
        documentExpiredAt,
        nuit,
        loginId,
      },
    })

    // Caso a criação do estudante seja bem-sucedida, pode retornar uma resposta ou apenas continuar o fluxo
    return student // ou outra resposta que você precise
  } catch (error) {
    // Captura de erro
    console.error('Erro ao criar o estudante:', error)
  }
}

export const findStudentById = async (studentId: string) => {
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
  })
  return student
}

export const findStudentByLoginId = async (loginId: string) => {
  const student = await prismaClient.student.findFirst({
    where: { loginId },
  })
  return student
}
export const findStudentByNuit = async (nuit: number) => {
  const student = await prismaClient.student.findFirst({
    where: { nuit },
  })
  return student
}

export const findStudentByDocumentNumber = async (documentNumber: string) => {
  const student = await prismaClient.student.findFirst({
    where: { documentNumber },
  })
  return student
}

export async function listAllStudents() {
  const data = await prismaClient.student.findMany()
  return data
}

export async function getStudentById(id: string) {
  const data = await prismaClient.student.findUnique({
    where: {
      id,
    },
  })
  return data
}

export async function updateStudent(id: string, data: studentRequest) {
  const student = await prismaClient.student.update({
    where: {
      id,
    },
    data,
  })
  return student
}

export async function deleteStudent(id: string) {
  const student = await prismaClient.student.delete({
    where: {
      id,
    },
  })
  return student
}
