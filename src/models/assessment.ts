import { prismaClient } from '../database/script'

interface assessmentRequest {
  name: string
  type: string
  dateApplied: Date
  subjectId: string // ID da disciplina, presumo que seja uma string
}

interface updateAssessmentRequest {
  assessmentId: string
  name?: string
  type?: string
  dateApplied?: Date
  subjectId?: string
}

export async function createAssessment({
  name,
  type,
  dateApplied,
  subjectId,
}: assessmentRequest) {
  try {
    // Validações para garantir que os campos sejam preenchidos corretamente
    if (!name || !type || !dateApplied || !subjectId) {
      return {
        success: false,
        message:
          'Todos os campos são obrigatórios: name, type, dateApplied, subjectId.',
      }
    }

    // Criando a avaliação no banco de dados
    const assessment = await prismaClient.assessment.create({
      data: {
        name,
        type,
        dateApplied,
        subjectId,
      },
    })

    // Retorno bem-sucedido
    return {
      success: true,
      message: 'Avaliação criada com sucesso.',
      data: assessment,
    }
  } catch (error) {
    // Tratamento de erro
    console.error('Erro ao criar avaliação:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao criar a avaliação.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function listAllAssessments() {
  try {
    const assessments = await prismaClient.assessment.findMany({
      include: {
        subject: true, // Inclui dados da disciplina associada
      },
    })

    return assessments
  } catch (error) {
    console.error('Erro ao listar avaliações:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao listar as avaliações.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function getAssessmentBySubjectId(subjectId: string) {
  try {
    // Buscando todas as avaliações associadas ao subjectId
    const result = await prismaClient.assessment.findMany({
      where: { subjectId },
    })

    // Se não houver avaliações, retorne uma mensagem informando
    if (result.length === 0) {
      return {
        success: false,
        message: 'Nenhuma avaliação encontrada para o assunto informado.',
      }
    }

    // Caso tenha encontrado as avaliações, retorne-as com sucesso
    return {
      success: true,
      message: 'Avaliações listadas com sucesso.',
      data: result,
    }
  } catch (error) {
    console.error('Erro ao listar avaliações do assunto:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao listar as avaliações do assunto.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function listAssessmentsByStudent(studentId: string) {
  try {
    // Consultando todas as avaliações relacionadas ao aluno
    const results = await prismaClient.assessmentResult.findMany({
      where: {
        studentId: studentId, // Filtro para o studentId
      },
      include: {
        assessment: true, // Inclui os dados da avaliação associada
      },
    })

    return {
      success: true,
      message: 'Avaliações do aluno listadas com sucesso.',
      data: results,
    }
  } catch (error) {
    console.error('Erro ao listar avaliações do aluno:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao listar as avaliações do aluno.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function updateAssessment({
  assessmentId,
  name,
  type,
  dateApplied,
  subjectId,
}: updateAssessmentRequest) {
  try {
    // Verificando se o assessmentId foi passado
    if (!assessmentId) {
      return {
        success: false,
        message: 'O campo assessmentId é obrigatório.',
      }
    }

    // Atualizando os dados da avaliação
    const updatedAssessment = await prismaClient.assessment.update({
      where: {
        id: assessmentId, // Filtro para o ID da avaliação
      },
      data: {
        name,
        type,
        dateApplied,
        subjectId,
      },
    })

    return {
      success: true,
      message: 'Avaliação atualizada com sucesso.',
      data: updatedAssessment,
    }
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao atualizar a avaliação.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function deleteAssessment(assessmentId: string) {
  try {
    // Verificando se o assessmentId foi passado
    if (!assessmentId) {
      return {
        success: false,
        message: 'O campo assessmentId é obrigatório.',
      }
    }

    // Deletando a avaliação
    const deletedAssessment = await prismaClient.assessment.delete({
      where: {
        id: assessmentId, // Filtro para o ID da avaliação
      },
    })

    return {
      success: true,
      message: 'Avaliação deletada com sucesso.',
      data: deletedAssessment,
    }
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao deletar a avaliação.',
      error: (error as unknown as Error).message,
    }
  }
}
