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
// Estudantes
import { StudentsLogin } from './route/student/login-students-route'
import { Student_Subject } from './route/student/student-subject-route'
import { Students } from './route/student/student-route'
import { Registrations } from './route/student/registration-route'
// Professores
import { TeacherSubject } from './route/teacher/teacher-subject-route'
import { teachersData } from './route/teacher/teacher-route'
// Cursos e Disciplinas
import { Courses } from './route/course/course-route'
import { Subjects } from './route/course/subjects-route'
// Avaliações
import { Assessments } from './route/assessment/assessments-route'
import { AssessmentsResult } from './route/assessment/assessmentsResult-route'
// Autenticação e Usuário
import { Login } from './route/auth/login-route'
import { UserRoutes } from './route/auth/user/user-route'
// Institucional
import { PreInstitutos } from './route/institution/preinstitute-route'
// Funcionários
import { EmployeeRoute } from './route/employee/employees/employee-route'
import { EmployeeEducationRoute } from './route/employee/employees/employeeEducationRoute'
import { EmployeeBankRoute } from './route/employee/employees/employeeBank-route'
// Pagamentos
import { InvoiceRoutes } from './route/payment/invoice-route'
import { PaymentRoutes } from './route/payment/payment-route'
import { PaymentReminderRoutes } from './route/payment/payment-reminder-route'
import { LateFeeRoutes } from './route/payment/late-fee-route'
import { InvoiceHistoryRoutes } from './route/payment/invoice-history-route'
// Cors
import { corsOptions } from './config/cors'

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
      { name: 'login', description: 'Operações de autenticação' },
      {
        name: 'students',
        description: 'Operações relacionadas a estudantes',
      },
      { name: 'course', description: 'Operações relacionados a cursos' },

      {
        name: 'teachers',
        description: 'Operações relacionadas a professores',
      },
      {
        name: 'subjects',
        description: 'Operações relacionadas a disciplinas',
      },
      {
        name: 'assessments',
        description: 'Operações relacionadas a avaliações',
      },
      {
        name: 'payments',
        description: 'Operações relacionadas a pagamentos',
      },
      {
        name: 'employees',
        description: 'Operações relacionadas a funcionÃ¡rios',
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
