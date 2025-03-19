import type { ProvincyAddress } from '@prisma/client'
import { prismaClient } from '../database/script'

interface createEducationOfficerRequest {
  fullName: string
  profession: string
  dataOfBirth: Date
  email: string
  contact: string
  provincyAddress: ProvincyAddress
  address: string
}

export async function insertEducationOffice({
  fullName,
  profession,
  dataOfBirth,
  email,
  contact,
  provincyAddress,
  address,
}: createEducationOfficerRequest) {
  const data = await prismaClient.educationOfficer.create({
    data: {
      fullName,
      profession,
      dataOfBirth,
      email,
      contact,
      provincyAddress,
      address,
    },
  })

  return data
}

export async function listAllEducationOfficers() {
  const data = await prismaClient.educationOfficer.findMany()
  return data
}

export async function getEducationOfficerById(id: string) {
  const data = await prismaClient.educationOfficer.findUnique({
    where: {
      id,
    },
  })
  return data
}

export async function updateEducationOfficer(
  id: string,
  {
    fullName,
    profession,
    dataOfBirth,
    email,
    contact,
    provincyAddress,
    address,
  }: createEducationOfficerRequest
) {
  const data = await prismaClient.educationOfficer.update({
    where: {
      id,
    },
    data: {
      fullName,
      profession,
      dataOfBirth,
      email,
      contact,
      provincyAddress,
      address,
    },
  })
  return data
}

export async function deleteEducationOfficer(id: string) {
  const data = await prismaClient.educationOfficer.delete({
    where: {
      id,
    },
  })
  return data
}
