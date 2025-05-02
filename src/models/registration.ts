import type { Status } from '@prisma/client'
import { prismaClient } from '../database/script'

interface createRegistrationRequest {
  courseId: string
  studentId: string
}

interface createRegistrationRequestWithStatus
  extends createRegistrationRequest {
  registrationStatus: Status
}

export const createRegistration = async ({
  courseId,
  studentId,
}: createRegistrationRequest) => {
  const registration = await prismaClient.registration.create({
    data: {
      courseId,
      studentId,
    },
  })
  return registration
}

export const createRegistrationWithConfirmationStatus = async ({
  courseId,
  studentId,
  registrationStatus,
}: createRegistrationRequestWithStatus) => {
  const registration = await prismaClient.registration.create({
    data: {
      courseId,
      studentId,
      registrationStatus,
    },
  })
  return registration
}

export async function listAllRegistrations() {
  const data = await prismaClient.registration.findMany({
    include: {
      course: true,
      student: true,
    },
  })
  return data
}

export async function getRegistrationById(id: string) {
  const data = await prismaClient.registration.findUnique({
    where: {
      id,
    },
  })
  return data
}

export async function getRegistrationByCourseId(courseId: string) {
  const data = await prismaClient.registration.findMany({
    where: {
      courseId,
    },
    include: {
      course: true,
      student: true,
    },
  })
  return data
}

export async function getRegistrationByStudentId(studentId: string) {
  const data = await prismaClient.registration.findMany({
    where: {
      studentId,
    },
  })
  return data
}

export async function updateRegistration(
  id: string,
  courseId: string,
  studentId: string
) {
  const data = await prismaClient.registration.update({
    where: {
      id,
    },
    data: {
      courseId,
      studentId,
    },
  })
  return data
}

export async function deleteRegistration(id: string) {
  const data = await prismaClient.registration.delete({
    where: {
      id,
    },
  })
}
