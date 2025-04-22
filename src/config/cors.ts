import type { FastifyCorsOptions } from '@fastify/cors'

export const corsOptions: FastifyCorsOptions = {
  // List of allowed origins
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allowed HTTP headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],

  // Exposed headers
  exposedHeaders: ['Content-Range', 'X-Content-Range'],

  // Credentials
  credentials: true,

  // Max age of the CORS preflight request
  maxAge: 86400, // 24 hours

  // Enable preflight requests
  preflight: true,

  // Strict preflight
  strictPreflight: true,

  // Hide options route
  hideOptionsRoute: false,
}
