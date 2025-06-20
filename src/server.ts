import { fastify } from 'fastify'
import cors from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { StudentsLogin } from './route/login-students-route'
import { Student_Subject } from './route/student-subject-route'
import { TeacherSubject } from './route/teacher-subject-route'
import { Login } from './route/login-route'
import { PreInstitutos } from './route/preinstitute-route'
import { Courses } from './route/course-route'
import { Registrations } from './route/registration-route'
import { Subjects } from './route/subjects-route'
import { teachersData } from './route/teacher-route'
import { Students } from './route/student-route'
import { Assessments } from './route/assessments-route'
import { AssessmentsResult } from './route/assessmentsResult-route'
import { InvoiceRoutes } from './route/payment/invoice-route'
import { PaymentReminderRoutes } from './route/payment/payment-reminder-route'
import { LateFeeRoutes } from './route/payment/late-fee-route'
import { InvoiceHistoryRoutes } from './route/payment/invoice-history-route'
import { corsOptions } from './config/cors'
import { UserRoutes } from './route/user/user-route'
import { EmployeeRoute } from './route/employees/employee-route'
import { EmployeeEducationRoute } from './route/employees/employeeEducationRoute'
import { EmployeeBankRoute } from './route/employees/employeeBank-route'
import { PaymentRoutes } from './route/payment/payment-route'

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Register CORS with options
app.register(cors, corsOptions)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'MMA API',
      description: 'API do sistema de gestÃ£o acadÃªmica',
      version: '1.0.0',
      contact: {
        name: 'Suporte MMA',
        email: 'suporte@mma.ac.mz',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer <token>',
        },
      },
    },
    tags: [
      { name: 'login', description: 'OperaÃ§Ãµes de autenticaÃ§Ã£o' },
      {
        name: 'students',
        description: 'OperaÃ§Ãµes relacionadas a estudantes',
      },
      { name: 'course', description: 'OperaÃ§Ãµes relacionados a cursos' },

      {
        name: 'teachers',
        description: 'OperaÃ§Ãµes relacionadas a professores',
      },
      {
        name: 'subjects',
        description: 'OperaÃ§Ãµes relacionadas a disciplinas',
      },
      {
        name: 'assessments',
        description: 'OperaÃ§Ãµes relacionadas a avaliaÃ§Ãµes',
      },
      {
        name: 'payments',
        description: 'OperaÃ§Ãµes relacionadas a pagamentos',
      },
      {
        name: 'employees',
        description: 'OperaÃ§Ãµes relacionadas a funcionÃ¡rios',
      },
    ],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
  staticCSP: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'validator.swagger.io'],
    'connect-src': ["'self'"],
  },
  transformStaticCSP: header => header,
})

app.register(Login)
app.register(Students)
app.register(StudentsLogin)
app.register(PreInstitutos)
app.register(Courses)
app.register(Registrations)
app.register(Subjects)

app.register(Student_Subject)
app.register(teachersData)
app.register(TeacherSubject)

app.register(Assessments)
app.register(AssessmentsResult)

// Register the routes for invoice and payment
app.register(InvoiceRoutes)
app.register(PaymentRoutes)
app.register(PaymentReminderRoutes)
app.register(LateFeeRoutes)
app.register(InvoiceHistoryRoutes)

// Register the routes for user and employee
app.register(UserRoutes)
app.register(EmployeeRoute)
app.register(EmployeeEducationRoute)
app.register(EmployeeBankRoute)
app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('http server running')
    app.log.info(
      `Servidor rodando na porta ${process.env.PORT ? Number(process.env.PORT) : 3333}`
    )
  })
  .catch(err => {
    console.error(err)
    app.log.error('Erro ao iniciar o servidor', err)
    process.exit(1)
  })
