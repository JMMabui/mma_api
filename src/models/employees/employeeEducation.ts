import { prismaClient } from '../../database/script'

interface createEmployeeEducationRequest {
  employeerId: string
  institutionName: string
  degree: string
  fieldOfStudy: string
  startDate: Date
  endDate: Date
}

interface updateEmployeeEducationRequest {
  employeerId?: string
  institutionName?: string
  degree?: string
  fieldOfStudy?: string
  startDate?: Date
  endDate?: Date
}

export const employeeEducationModel = {
  async create({
    employeerId,
    institutionName,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
  }: createEmployeeEducationRequest) {
    return await prismaClient.employeeEducation.create({
      data: {
        employeerId,
        institutionName,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
      },
    })
  },
  async findAll() {
    return await prismaClient.employeeEducation.findMany()
  },

  async findById(id: string) {
    return await prismaClient.employeeEducation.findUnique({
      where: { id },
    })
  },

  async findByEmployeeId(employeerId: string) {
    return await prismaClient.employeeEducation.findMany({
      where: { employeerId },
    })
  },

  async update(
    id: string,
    {
      employeerId,
      institutionName,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
    }: updateEmployeeEducationRequest
  ) {
    return await prismaClient.employeeEducation.update({
      where: { id },
      data: {
        employeerId,
        institutionName,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
      },
    })
  },

  async deleteAll() {
    return await prismaClient.employeeEducation.deleteMany({})
  },

  async deleteById(id: string) {
    return await prismaClient.employeeEducation.delete({
      where: { id },
    })
  },
}
