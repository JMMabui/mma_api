import { prismaClient } from '../../database/script'

interface createEmployeeBankRequest {
  employeerId: string
  bankName: string
  accountNumber: string
  accountType: string
  accountHolder: string
}

interface updateEmployeeBankRequest {
  employeerId?: string
  bankName?: string
  accountNumber?: string
  accountType?: string
  accountHolder?: string
}

export const employeeBankModel = {
  async create({
    employeerId,
    bankName,
    accountNumber,
    accountType,
    accountHolder,
  }: createEmployeeBankRequest) {
    return await prismaClient.employeeBank.create({
      data: {
        employeerId,
        bankName,
        accountNumber,
        accountType,
        accountHolder,
      },
    })
  },

  async findAll() {
    return await prismaClient.employeeBank.findMany()
  },

  async findById(id: string) {
    return await prismaClient.employeeBank.findUnique({
      where: { id },
    })
  },

  async findByEmployeeId(employeerId: string) {
    return await prismaClient.employeeBank.findMany({
      where: { employeerId },
    })
  },

  async update(id: string, { ...data }: updateEmployeeBankRequest) {
    return await prismaClient.employeeBank.update({
      where: { id },
      data: { ...data },
    })
  },

  async delete() {
    return await prismaClient.employeeBank.deleteMany()
  },

  async deleteById(id: string) {
    return await prismaClient.employeeBank.delete({
      where: { id },
    })
  },
}
