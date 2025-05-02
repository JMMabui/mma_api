import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar cursos
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        courseName: 'Informática',
        courseDescription: 'Curso de Informática com foco em desenvolvimento',
        courseDuration: 3,
        levelCourse: 'TECNICO_MEDIO',
        period: 'LABORAL',
        totalVacancies: 30,
        availableVacancies: 30,
      },
    }),
    prisma.course.create({
      data: {
        courseName: 'Gestão',
        courseDescription: 'Curso de Gestão Empresarial',
        courseDuration: 3,
        levelCourse: 'TECNICO_MEDIO',
        period: 'POS_LABORAL',
        totalVacancies: 30,
        availableVacancies: 30,
      },
    }),
  ])

  // Criar disciplinas
  const subjects = await Promise.all([
    // Disciplinas de Informática
    prisma.subject.create({
      data: {
        codigo: 'INF101',
        subjectName: 'Programação I',
        year_study: 'PRIMEIRO_ANO',
        semester: 'PRIMEIRO_SEMESTRE',
        hcs: 60,
        credits: 4,
        subjectType: 'NUCLEAR',
        courseId: courses[0].id,
      },
    }),
    prisma.subject.create({
      data: {
        codigo: 'INF102',
        subjectName: 'Banco de Dados',
        year_study: 'PRIMEIRO_ANO',
        semester: 'SEGUNDO_SEMESTRE',
        hcs: 60,
        credits: 4,
        subjectType: 'NUCLEAR',
        courseId: courses[0].id,
      },
    }),
    // Disciplinas de Gestão
    prisma.subject.create({
      data: {
        codigo: 'GES101',
        subjectName: 'Gestão Financeira',
        year_study: 'PRIMEIRO_ANO',
        semester: 'PRIMEIRO_SEMESTRE',
        hcs: 60,
        credits: 4,
        subjectType: 'NUCLEAR',
        courseId: courses[1].id,
      },
    }),
  ])

  // Criar professores
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        surname: 'Silva',
        name: 'João',
        email: 'joao.silva@escola.com',
        contact: '841234567',
        teacherType: 'DOCENTE',
        statusTeacher: 'ATIVO',
      },
    }),
    prisma.teacher.create({
      data: {
        surname: 'Santos',
        name: 'Maria',
        email: 'maria.santos@escola.com',
        contact: '842345678',
        teacherType: 'DOCENTE',
        statusTeacher: 'ATIVO',
      },
    }),
  ])

  // Atribuir professores às disciplinas
  await Promise.all([
    prisma.teacherSubject.create({
      data: {
        teacherId: teachers[0].id,
        subjectId: subjects[0].codigo,
        status: 'ATIVO',
      },
    }),
    prisma.teacherSubject.create({
      data: {
        teacherId: teachers[1].id,
        subjectId: subjects[1].codigo,
        status: 'ATIVO',
      },
    }),
  ])

  // Criar logins para estudantes
  const hashedPassword = await bcrypt.hash('123456', 10)
  const logins = await Promise.all([
    prisma.loginData.create({
      data: {
        email: 'estudante1@escola.com',
        contact: '843456789',
        password: hashedPassword,
        jobPosition: 'ESTUDANTE',
      },
    }),
    prisma.loginData.create({
      data: {
        email: 'estudante2@escola.com',
        contact: '844567890',
        password: hashedPassword,
        jobPosition: 'ESTUDANTE',
      },
    }),
  ])

  // Criar estudantes
  const students = await Promise.all([
    prisma.student.create({
      data: {
        surname: 'Pereira',
        name: 'Carlos',
        dataOfBirth: new Date('2000-01-01'),
        placeOfBirth: 'Maputo',
        gender: 'MASCULINO',
        maritalStatus: 'SOLTEIRO',
        provincyAddress: 'MAPUTO_CIDADE',
        address: 'Av. 25 de Setembro, 123',
        fatherName: 'José Pereira',
        motherName: 'Maria Pereira',
        documentType: 'BI',
        documentNumber: '123456789',
        documentIssuedAt: new Date('2015-01-01'),
        documentExpiredAt: new Date('2025-01-01'),
        nuit: 123456789,
        loginId: logins[0].id,
      },
    }),
    prisma.student.create({
      data: {
        surname: 'Fernandes',
        name: 'Ana',
        dataOfBirth: new Date('2001-02-02'),
        placeOfBirth: 'Matola',
        gender: 'FEMININO',
        maritalStatus: 'SOLTEIRO',
        provincyAddress: 'MAPUTO_PROVINCIA',
        address: 'Av. Acordos de Lusaka, 456',
        fatherName: 'Manuel Fernandes',
        motherName: 'Teresa Fernandes',
        documentType: 'BI',
        documentNumber: '987654321',
        documentIssuedAt: new Date('2016-02-02'),
        documentExpiredAt: new Date('2026-02-02'),
        nuit: 987654321,
        loginId: logins[1].id,
      },
    }),
  ])

  // Criar matrículas
  await Promise.all([
    prisma.registration.create({
      data: {
        studentId: students[0].id,
        courseId: courses[0].id,
        registrationStatus: 'CONFIRMADO',
      },
    }),
    prisma.registration.create({
      data: {
        studentId: students[1].id,
        courseId: courses[1].id,
        registrationStatus: 'CONFIRMADO',
      },
    }),
  ])

  // Criar avaliações
  const assessments = await Promise.all([
    prisma.assessment.create({
      data: {
        name: 'Prova 1',
        assessmentType: 'TESTE_INDIVIDUAL',
        dateApplied: new Date('2024-05-01'),
        weight: 0.3,
        subjectId: subjects[0].codigo,
      },
    }),
    prisma.assessment.create({
      data: {
        name: 'Trabalho Prático',
        assessmentType: 'TRABALHO_GRUPO',
        dateApplied: new Date('2024-05-15'),
        weight: 0.2,
        subjectId: subjects[0].codigo,
      },
    }),
  ])

  // Criar resultados de avaliações
  await Promise.all([
    prisma.assessmentResult.create({
      data: {
        studentId: students[0].id,
        assessmentId: assessments[0].id,
        grade: 15,
      },
    }),
    prisma.assessmentResult.create({
      data: {
        studentId: students[0].id,
        assessmentId: assessments[1].id,
        grade: 18,
      },
    }),
  ])

  console.log('Seed concluído com sucesso!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
