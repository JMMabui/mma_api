import { prismaClient } from '../database/script'

interface CreateTeacherSubjectRequest {
  teacherId: string
  subjectId: string
}

export const TeacherSubjectModel = {
  async create(data: CreateTeacherSubjectRequest) {
    return await prismaClient.teacherSubject.create({
      data: {
        teacherId: data.teacherId,
        subjectId: data.subjectId,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.teacherSubject.findUnique({
      where: { id },
      include: {
        teacher: true,
        Subject: true,
      },
    })
  },

  async findByTeacherId(teacherId: string) {
    return await prismaClient.teacherSubject.findMany({
      where: { teacherId },
      include: {
        Subject: true,
      },
    })
  },

  async findBySubjectId(subjectId: string) {
    return await prismaClient.teacherSubject.findMany({
      where: { subjectId },
      include: {
        teacher: true,
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.teacherSubject.delete({
      where: { id },
    })
  },

  async deleteByTeacherId(teacherId: string) {
    return await prismaClient.teacherSubject.deleteMany({
      where: { teacherId },
    })
  },

  async deleteBySubjectId(subjectId: string) {
    return await prismaClient.teacherSubject.deleteMany({
      where: { subjectId },
    })
  },

  async getTeacherSubjects(teacherId: string) {
    return await prismaClient.teacherSubject.findMany({
      where: { teacherId },
      include: {
        Subject: true,
      },
    })
  },

  async getSubjectTeachers(subjectId: string) {
    return await prismaClient.teacherSubject.findMany({
      where: { subjectId },
      include: {
        teacher: true,
      },
    })
  },
}
