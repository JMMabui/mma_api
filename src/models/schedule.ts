import { prismaClient } from '../database/script'

interface scheduleRequest {
  weekDay: string
  startTime: Date
  endTime: Date
  subjectId: string
}

export async function createSchedule({
  weekDay,
  startTime,
  endTime,
  subjectId,
}: scheduleRequest) {
  try {
    // Validações simples para garantir que os dados sejam válidos
    if (!weekDay || !startTime || !endTime || !subjectId) {
      return {
        success: false,
        message:
          'Todos os campos são obrigatórios: weekDay, startTime, endTime, subjectId.',
      }
    }

    // Garantir que o startTime seja antes do endTime
    if (startTime >= endTime) {
      return {
        success: false,
        message: 'O horário de início deve ser antes do horário de término.',
      }
    }

    // Criando o agendamento no banco de dados
    const schedule = await prismaClient.schedule.create({
      data: {
        weekDay,
        startTime,
        endTime,
        subjectId,
      },
    })

    // Retorno bem-sucedido
    return {
      success: true,
      message: 'Horário criado com sucesso.',
      data: schedule,
    }
  } catch (error) {
    // Tratamento de erro
    console.error('Erro ao criar o horário:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao criar o horário.',
      error: (error as unknown as Error).message,
    }
  }
}

export async function listAllSchedule() {
  try {
    // Buscando todos os registros de schedule
    const schedules = await prismaClient.schedule.findMany()

    // Verificando se não existem registros
    if (schedules.length === 0) {
      return {
        success: false,
        message: 'Nenhum horário encontrado.',
        data: [],
      }
    }

    return {
      success: true,
      message: 'Horários encontrados com sucesso.',
      data: schedules,
    }
  } catch (error) {
    // Tratando erros inesperados
    console.error('Erro ao listar horários:', error)
    return {
      success: false,
      message: 'Ocorreu um erro ao buscar os horários.',
      error: (error as unknown as Error).message,
    }
  }
}
