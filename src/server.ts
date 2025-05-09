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
import { InvoiceRoutes } from './route/invoice-route'
import { PaymentRoutes } from './route/payment-route'
import { PaymentReminderRoutes } from './route/payment-reminder-route'
import { LateFeeRoutes } from './route/late-fee-route'
import { InvoiceHistoryRoutes } from './route/invoice-history-route'
import { corsOptions } from './config/cors'
import { UserRoutes } from './route/user/user-route'
import { EmployeeRoute } from './route/employees/employee-route'
import { EmployeeEducationRoute } from './route/employees/employeeEducationRoute'
import { EmployeeBankRoute } from './route/employees/employeeBank-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Register CORS with options
app.register(cors, corsOptions)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'api',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
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
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
