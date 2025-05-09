import type { EmployeeType } from '@prisma/client'
import { prismaClient } from '../../database/script'

interface createEmployeeRequest {
  userId: string
  employeeType: EmployeeType
  jobTitle: string
  department: string
  dateOfHire: Date
  salary: number
  loginId: string
}

interface updateEmployeeRequest {
  id?: string
  userId?: string
  employeeType?: EmployeeType
  jobTitle?: string
  department?: string
  dateOfHire?: Date
  salary?: number
  loginId?: string
}

export const employeeModel = {
  async create({
    userId,
    employeeType,
    jobTitle,
    department,
    dateOfHire,
    salary,
    loginId,
  }: createEmployeeRequest) {
    return await prismaClient.employees.create({
      data: {
        userId,
        employeeType,
        jobTitle,
        department,
        dateOfHire,
        salary,
        loginId,
      },
    })
  },

  async update({ id, ...data }: updateEmployeeRequest) {
    return await prismaClient.employees.update({
      where: { id },
      data: { ...data },
    })
  },

  async findById(id: string) {
    return await prismaClient.employees.findUnique({
      where: { id },
    })
  },

  async findAll() {
    return await prismaClient.employees.findMany()
  },

  async delete() {
    return await prismaClient.employees.deleteMany()
  },

  async deleteById(id: string) {
    return await prismaClient.employees.delete({
      where: { id },
    })
  },

  async findByUserId(userId: string) {
    return await prismaClient.employees.findMany({
      where: { userId },
    })
  },

  async findByLoginId(loginId: string) {
    return await prismaClient.employees.findMany({
      where: { loginId },
      include: {
        user: true,
        EmployeeEducation: true,
        EmployeeBank: true,
        login: true,
      },
    })
  },
}
