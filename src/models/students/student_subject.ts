import { prismaClient } from '../../database/script'

interface student_subject_schema {
  studentId: string
  subjectId: string
}

export async function createStudentSubject({
  studentId,
  subjectId,
}: student_subject_schema) {
  const student_subject = await prismaClient.studentSubject.create({
    data: {
      studentId,
      subjectId,
    },
  })

  return student_subject
}
export async function listAllStudentsSubjects() {
  try {
    // Realiza a consulta no banco de dados para buscar todas as disciplinas dos estudantes
    const result = await prismaClient.studentSubject.findMany({
      include: {
        Subject: true,
        student: true,
      },
    })

    // Retorna o resultado obtido da consulta
    return result
  } catch (error) {
    // Tratamento de erros, caso ocorra algum problema na consulta
    console.error('Error fetching all student subjects:', error)
    throw new Error('Failed to fetch student subjects') // Lança um erro personalizado
  }
}

export async function getStudentSubjectsByStudentId(id: string) {
  try {
    // Realiza a consulta no banco de dados para buscar as disciplinas do estudante com o `id` fornecido
    const studentSubjects = await prismaClient.studentSubject.findMany({
      where: {
        studentId: id, // Filtra as disciplinas pelo ID do estudante
      },
      include: {
        Subject: {},
        student: {},
      },
    })

    // Retorna as disciplinas encontradas
    return studentSubjects
  } catch (error) {
    // Tratamento de erro caso a consulta falhe
    console.error(`Error fetching subjects for student with ID ${id}:`, error)
    throw new Error('Failed to fetch student subjects') // Lança um erro customizado
  }
}

export async function getStudentSubjectsBySubjectId(id: string) {
  try {
    // Realiza a consulta no banco de dados para buscar as disciplinas do estudante com o `id` fornecido
    const studentSubjects = await prismaClient.studentSubject.findMany({
      where: {
        subjectId: id, // Filtra as disciplinas pelo ID do estudante
      },
      include: {
        Subject: {},
        student: {},
      },
    })

    // Retorna as disciplinas encontradas
    return studentSubjects
  } catch (error) {
    // Tratamento de erro caso a consulta falhe
    console.error(`Error fetching subjects for student with ID ${id}:`, error)
    throw new Error('Failed to fetch student subjects') // Lança um erro customizado
  }
}
