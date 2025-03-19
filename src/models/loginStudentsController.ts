import type {
  Gender,
  MaritalStatus,
  ProvincyAddress,
  DocumentType,
} from '@prisma/client'
import { prismaClient } from '../database/script'
import bcrypt from 'bcryptjs'

// Definição do tipo para loginData
interface LoginData {
  email: string
  password: string
  contact: string
}

// Definição do tipo para os dados do estudante
interface CreateStudentSchema {
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
  loginData: LoginData // Alteração para tipo específico
}

// Função para criar o estudante
export async function createStudent({
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
  loginData,
}: CreateStudentSchema) {
  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(loginData.password, 10)

    // Criando o loginData primeiro
    const createdLoginData = await prismaClient.loginData.create({
      data: {
        email: loginData.email,
        contact: loginData.contact,
        password: hashedPassword,
      },
    })

    // Agora criando o estudante e associando o loginData criado
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
        loginData: {
          connect: { id: createdLoginData.id },
        },
      },
    })

    return student
  } catch (error) {
    // Tratar erros de forma mais clara
    if (error instanceof Error) {
      throw new Error(`Erro ao criar o estudante: ${error.message}`)
    }
    throw new Error('Erro ao criar o estudante: erro desconhecido')
  }
}
