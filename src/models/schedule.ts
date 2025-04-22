import { prismaClient } from '../database/script'

interface CreateScheduleRequest {
  classId: string
  dayOfWeek: number
  startTime: Date
  endTime: Date
}

interface UpdateScheduleRequest {
  dayOfWeek?: number
  startTime?: Date
  endTime?: Date
}

export const ScheduleModel = {
  async create(data: CreateScheduleRequest) {
    return await prismaClient.schedule.create({
      data: {
        class_id: data.classId,
        dayOfWeek: data.dayOfWeek,
        start_time: data.startTime,
        end_time: data.endTime,
      },
    })
  },

  async findById(id: string) {
    return await prismaClient.schedule.findUnique({
      where: { id },
      include: {
        classes: true,
      },
    })
  },

  async findByClassId(classId: string) {
    return await prismaClient.schedule.findMany({
      where: { class_id: classId },
      include: {
        classes: true,
      },
    })
  },

  async update(id: string, data: UpdateScheduleRequest) {
    return await prismaClient.schedule.update({
      where: { id },
      data: {
        dayOfWeek: data.dayOfWeek,
        start_time: data.startTime,
        end_time: data.endTime,
      },
    })
  },

  async delete(id: string) {
    return await prismaClient.schedule.delete({
      where: { id },
    })
  },

  async deleteByClassId(classId: string) {
    return await prismaClient.schedule.deleteMany({
      where: { class_id: classId },
    })
  },

  async getClassSchedule(classId: string) {
    return await prismaClient.schedule.findMany({
      where: { class_id: classId },
      orderBy: {
        dayOfWeek: 'asc',
      },
    })
  },
}
