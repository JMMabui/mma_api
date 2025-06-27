import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import type { FastifyTypeInstance } from '../../types/type'
import { createdPreInstituto } from '../../models/preInstituto'
import { prismaClient } from '../../database/script'

export const PreInstitutos: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/pre-instituto',
    {
      schema: {
        tags: ['pre-school'],
        description: 'create a pre school information',
        body: z.object({
          schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA']),
          schoolName: z.string(),
          schoolProvincy: z.enum([
            'MAPUTO_CIDADE',
            'MAPUTO_PROVINCIA',
            'GAZA',
            'INHAMBANE',
            'MANICA',
            'SOFALA',
            'TETE',
            'ZAMBEZIA',
            'NAMPULA',
            'CABO_DELGADO',
            'NIASSA',
          ]),
          studentId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      // console.log(request.body)
      try {
        const { schoolLevel, schoolName, schoolProvincy, studentId } =
          request.body
        const preinstituto = await createdPreInstituto({
          schoolLevel,
          schoolName,
          schoolProvincy,
          studentId,
        })

        reply.code(201).send({
          sucess: true,
          message: 'pre-instituto created successfully',
          data: preinstituto,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            sucess: false,
            message: 'Erro de validação',
            errors: error.errors,
          })
        }
        reply
          .code(500)
          .send({ sucess: false, message: 'Internal server error' })
      }
    }
  )

  app.get(
    '/pre-instituto',
    {
      schema: {
        tags: ['pre-school'],
        description: 'list all pre-isntitutional',
      },
    },
    async (request, reply) => {
      const preInstituto = await prismaClient.preSchool.findMany()
      return preInstituto
    }
  )
}
