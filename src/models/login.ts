import type { Job_Position } from './../../node_modules/.prisma/client/index.d'
import { prismaClient } from '../database/script'

interface LoginSchema {
  email: string
  contact: string
  password: string
  jobPosition: Job_Position
}

export async function createLogin({
  email,
  contact,
  password,
  jobPosition,
}: LoginSchema) {
  const login = await prismaClient.loginData.create({
    data: {
      email,
      contact,
      password,
      jobPosition,
    },
  })

  return login
}

export async function findLoginByEmail(email: string) {
  const login = await prismaClient.loginData.findUnique({
    where: { email },
  })
  return login
}
export async function findLoginById(id: string) {
  const login = await prismaClient.loginData.findUnique({
    where: { id },
  })
  return login
}
export async function updateLogin(id: string, data: LoginSchema) {
  const login = await prismaClient.loginData.update({
    where: { id },
    data,
  })
  return login
}
export async function deleteLogin(id: string) {
  const login = await prismaClient.loginData.delete({
    where: { id },
  })
  return login
}
