import type { DocumentType, Gender, MaritalStatus } from '@prisma/client'

import { prismaClient } from '../database/script'

interface createUserRequest {
  name: string
  surname: string
  dateOfBirth: Date
  gender: Gender
  identificationDocument: DocumentType
  identificationNumber: string
  documentIssuedAt: Date
  documentExpiredAt: Date
  taxIdentificationNumber: number
  maritalStatus: MaritalStatus
  address: string
}

interface updateUserRequest {
  name?: string
  surname?: string
  dateOfBirth?: Date
  gender?: Gender
  identificationDocument?: DocumentType
  identificationNumber?: string
  documentIssuedAt?: Date
  documentExpiredAt?: Date
  taxIdentificationNumber?: number
  maritalStatus?: MaritalStatus
  address?: string
}

export const userModel = {
  async create({
    name,
    surname,
    gender,
    address,
    dateOfBirth,
    documentExpiredAt,
    documentIssuedAt,
    identificationDocument,
    identificationNumber,
    maritalStatus,
    taxIdentificationNumber,
  }: createUserRequest) {
    return await prismaClient.user.create({
      data: {
        name,
        surname,
        gender,
        address,
        dateOfBirth,
        documentExpiredAt,
        documentIssuedAt,
        identificationDocument,
        identificationNumber,
        maritalStatus,
        taxIdentificationNumber,
      },
    })
  },

  async findAllUsers() {
    return await prismaClient.user.findMany({})
  },

  async findById(id: string) {
    return await prismaClient.user.findUnique({
      where: { id },
    })
  },

  async updateUser(
    id: string,
    {
      address,
      dateOfBirth,
      documentExpiredAt,
      documentIssuedAt,
      gender,
      identificationDocument,
      identificationNumber,
      maritalStatus,
      name,
      surname,
      taxIdentificationNumber,
    }: updateUserRequest
  ) {
    return await prismaClient.user.update({
      where: { id },
      data: {
        name,
        surname,
        gender,
        address,
        dateOfBirth,
        documentExpiredAt,
        documentIssuedAt,
        identificationDocument,
        identificationNumber,
        maritalStatus,
        taxIdentificationNumber,
      },
    })
  },

  async deleteUser(id: string) {
    return await prismaClient.user.delete({
      where: { id },
    })
  },

  async deleteAllUsers() {
    return await prismaClient.user.deleteMany({})
  },
}
