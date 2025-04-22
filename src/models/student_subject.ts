import { prismaClient } from '../database/script'

interface CreateStudentSubjectRequest {
  studentId: string
  subjectId: string
}

export const StudentSubjectModel = {
  async create(data: CreateStudentSubjectRequest) {
    return await prismaClient.studentSubject.create({
      data: {
        studentId: data.studentId,
        subjectId: data.subjectId,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.studentSubject.findUnique({
      where: { id },
      include: {
        student: true,
        Subject: true,
      },
    })
  },

  async findByStudentId(studentId: string) {
    return await prismaClient.studentSubject.findMany({
      where: { studentId },
      include: {
        Subject: true,
      },
    })
  },

  async findBySubjectId(subjectId: string) {
    return await prismaClient.studentSubject.findMany({
      where: { subjectId },
      include: {
        student: true,
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.studentSubject.delete({
      where: { id },
    })
  },

  async deleteByStudentId(studentId: string) {
    return await prismaClient.studentSubject.deleteMany({
      where: { studentId },
    })
  },

  async deleteBySubjectId(subjectId: string) {
    return await prismaClient.studentSubject.deleteMany({
      where: { subjectId },
    })
  },

  async getStudentSubjects(studentId: string) {
    return await prismaClient.studentSubject.findMany({
      where: { studentId },
      include: {
        Subject: true,
      },
    })
  },

  async getSubjectStudents(subjectId: string) {
    return await prismaClient.studentSubject.findMany({
      where: { subjectId },
      include: {
        student: true,
      },
    })
  },
}
