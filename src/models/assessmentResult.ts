import { prismaClient } from '../database/script'

interface assessmentResultRequest {
  assessmentId: string
  studentId: string
  grade: number
}

interface updateAssessmentResultRequest {
  assessmentResultId: string
  grade: number
}

export async function createAssessmentResult({
  assessmentId,
  studentId,
  grade,
}: assessmentResultRequest) {
  try {
    // Validações
    if (!assessmentId || !studentId || grade === undefined) {
      return {
        success: false,
        message: 'Os campos assessmentId, studentId e grade são obrigatórios.',
      }
    }

    // Criando o resultado da avaliação no banco de dados
    const assessmentResult = await prismaClient.assessmentResult.create({
      data: {
        assessmentId,
        studentId,
        grade,
      },
    })

    return {
      success: true,
      message: 'Resultado da avaliação criado com sucesso.',
      data: assessmentResult,
    }
  } catch (error) {
    console.error('Erro ao criar resultado da avaliação:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao criar o resultado da avaliação.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function listAllAssessmentsResult() {
  try {
    const result = await prismaClient.assessmentResult.findMany()

    return {
      sucess: true,
      message: 'Lista todos as avaliações',
      data: result,
    }
  } catch (error) {
    console.error('Erro ao listar resultados do aluno:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao listar os resultados do aluno.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function listResultsByStudent(studentId: string) {
  try {
    // Consultando os resultados das avaliações de um aluno
    const results = await prismaClient.assessmentResult.findMany({
      where: {
        studentId,
      },
      include: {
        assessment: true, // Inclui os dados da avaliação associada
      },
    })

    return {
      success: true,
      message: 'Resultados do aluno listados com sucesso.',
      data: results,
    }
  } catch (error) {
    console.error('Erro ao listar resultados do aluno:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao listar os resultados do aluno.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function updateAssessmentResult({
  assessmentResultId,
  grade,
}: updateAssessmentResultRequest) {
  try {
    // Verificando se o resultado da avaliação existe
    const existingResult = await prismaClient.assessmentResult.findUnique({
      where: {
        id: assessmentResultId,
      },
    })

    if (!existingResult) {
      return {
        success: false,
        message: 'Resultado da avaliação não encontrado.',
      }
    }

    // Atualizando o resultado
    const updatedResult = await prismaClient.assessmentResult.update({
      where: {
        id: assessmentResultId,
      },
      data: {
        grade,
      },
    })

    return {
      success: true,
      message: 'Resultado da avaliação atualizado com sucesso.',
      data: updatedResult,
    }
  } catch (error) {
    console.error('Erro ao atualizar resultado da avaliação:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao atualizar o resultado da avaliação.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function deleteAssessmentResult(assessmentResultId: string) {
  try {
    // Verificando se o resultado da avaliação existe
    const existingResult = await prismaClient.assessmentResult.findUnique({
      where: {
        id: assessmentResultId,
      },
    })

    if (!existingResult) {
      return {
        success: false,
        message: 'Resultado da avaliação não encontrado.',
      }
    }

    // Deletando o resultado da avaliação
    const deletedResult = await prismaClient.assessmentResult.delete({
      where: {
        id: assessmentResultId,
      },
    })

    return {
      success: true,
      message: 'Resultado da avaliação deletado com sucesso.',
      data: deletedResult,
    }
  } catch (error) {
    console.error('Erro ao deletar resultado da avaliação:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao deletar o resultado da avaliação.',
      error: (error as unknown as Error).message,
    }
  }
}
