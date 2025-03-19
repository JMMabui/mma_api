import type { Status } from '@prisma/client'
import { prismaClient } from '../database/script'

interface createRegistrationRequest {
  course_id: string
  student_id: string
}

interface createRegistrationRequestWithStatus
  extends createRegistrationRequest {
  registrationStatus: Status
}

export const createRegistration = async ({
  course_id,
  student_id,
}: createRegistrationRequest) => {
  const registration = await prismaClient.registration.create({
    data: {
      course_id,
      student_id,
    },
  })
  return registration
}

export const createRegistrationWithConfirmationStatus = async ({
  course_id,
  student_id,
  registrationStatus,
}: createRegistrationRequestWithStatus) => {
  const registration = await prismaClient.registration.create({
    data: {
      course_id,
      student_id,
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

export async function getRegistrationByCourseId(course_id: string) {
  const data = await prismaClient.registration.findMany({
    where: {
      course_id,
    },
  })
  return data
}

export async function getRegistrationByStudentId(student_id: string) {
  const data = await prismaClient.registration.findMany({
    where: {
      student_id,
    },
  })
  return data
}

export async function updateRegistration(
  id: string,
  course_id: string,
  student_id: string
) {
  const data = await prismaClient.registration.update({
    where: {
      id,
    },
    data: {
      course_id,
      student_id,
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
