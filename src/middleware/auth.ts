import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

declare module 'fastify' {
  interface FastifyRequest {
    user?: any
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply
      .code(401)
      .send({ success: false, message: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    // Opcional: anexar dados do usuário à requisição para usar em outras partes
    request.user = decoded
  } catch (error) {
    return reply.code(401).send({ success: false, message: 'Invalid token' })
  }
}
