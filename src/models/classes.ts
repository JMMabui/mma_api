import type { YearStudy, Semester, StatusClasses } from '@prisma/client'
import { prismaClient } from '../database/script'

interface CreateClassRequest {
  className: string
  courseId: string
  yearStudy: YearStudy
  semester: Semester
  statusClasses: StatusClasses
}

interface UpdateClassRequest {
  className?: string
  yearStudy?: YearStudy
  semester?: Semester
  statusClasses?: StatusClasses
}

export const ClassesModel = {
  async create(data: CreateClassRequest) {
    return await prismaClient.classes.create({
      data: {
        class_name: data.className,
        course_id: data.courseId,
        year_study: data.yearStudy,
        semester: data.semester,
        status_classes: data.statusClasses,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.classes.findUnique({
      where: { id },
      include: {
        course: true,
        StudentsClasses: {
          include: {
            student: true,
          },
        },
        schedule: true,
      },
    })
  },

  async findByCourseId(courseId: string) {
    return await prismaClient.classes.findMany({
      where: { course_id: courseId },
      include: {
        StudentsClasses: {
          include: {
            student: true,
          },
        },
        schedule: true,
      },
    })
  },

  async update(id: string, data: UpdateClassRequest) {
    return await prismaClient.classes.update({
      where: { id },
      data: {
        class_name: data.className,
        year_study: data.yearStudy,
        semester: data.semester,
        status_classes: data.statusClasses,
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.classes.delete({
      where: { id },
    })
  },

  async addStudent(classId: string, studentId: string) {
    return await prismaClient.studentsClasses.create({
      data: {
        class_id: classId,
        student_id: studentId,
      },
    })
  },

  async removeStudent(classId: string, studentId: string) {
    return await prismaClient.studentsClasses.deleteMany({
      where: {
        class_id: classId,
        student_id: studentId,
      },
    })
  },

  async addSchedule(
    classId: string,
    dayOfWeek: number,
    startTime: Date,
    endTime: Date
  ) {
    return await prismaClient.schedule.create({
      data: {
        class_id: classId,
        dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      },
    })
  },

  async getStudents(classId: string) {
    return await prismaClient.studentsClasses.findMany({
      where: { class_id: classId },
      include: {
        student: true,
      },
    })
  },

  async getSchedule(classId: string) {
    return await prismaClient.schedule.findMany({
      where: { class_id: classId },
    })
  },
}
