import { prismaClient } from '../database/script'

interface student_subject_schema {
  student_id: string
  disciplineId: string
}

export async function createStudentSubject({
  student_id,
  disciplineId,
}: student_subject_schema) {
  const student_subject = await prismaClient.studentDiscipline.create({
    data: {
      student_id,
      disciplineId,
    },
  })

  return student_subject
}
export async function listAllStudentsSubjects() {
  try {
    // Realiza a consulta no banco de dados para buscar todas as disciplinas dos estudantes
    const result = await prismaClient.studentDiscipline.findMany()

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
    const studentSubjects = await prismaClient.studentDiscipline.findMany({
      where: {
        student_id: id, // Filtra as disciplinas pelo ID do estudante
      },
      include: {
        discipline: {
          select: {
            disciplineName: true,
            semester: true,
            year_study: true,
          },
        },
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
