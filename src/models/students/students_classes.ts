import { prismaClient } from '../database/script'

interface CreateStudentsClassesRequest {
  studentId: string
  classId: string
}

export const StudentsClassesModel = {
  async create(data: CreateStudentsClassesRequest) {
    return await prismaClient.studentsClasses.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.studentsClasses.findUnique({
      where: { id },
      include: {
        student: true,
        classes: true,
      },
    })
  },

  async findByStudentId(studentId: string) {
    return await prismaClient.studentsClasses.findMany({
      where: { studentId },
      include: {
        classes: true,
      },
    })
  },

  async findByClassId(classId: string) {
    return await prismaClient.studentsClasses.findMany({
      where: { classId },
      include: {
        student: true,
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.studentsClasses.delete({
      where: { id },
    })
  },

  async deleteByStudentId(studentId: string) {
    return await prismaClient.studentsClasses.deleteMany({
      where: { studentId },
    })
  },

  async deleteByClassId(classId: string) {
    return await prismaClient.studentsClasses.deleteMany({
      where: { classId },
    })
  },

  async getClassStudents(classId: string) {
    return await prismaClient.studentsClasses.findMany({
      where: { classId },
      include: {
        student: true,
      },
    })
  },

  async getStudentClasses(studentId: string) {
    return await prismaClient.studentsClasses.findMany({
      where: { studentId },
      include: {
        classes: true,
      },
    })
  },
}
