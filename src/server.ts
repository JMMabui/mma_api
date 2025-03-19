import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
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
import { teacher_Subject } from './route/teacher-subject-route'
import { Login } from './route/login-route'
import { PreInstitutos } from './route/preinstitute-route'
import { Courses } from './route/course-route'
import { Registrations } from './route/registration-route'
import { Subjects } from './route/subjects-route'
import { teachersData } from './route/teacher-route'
import { Students } from './route/student-route'
import { Assessments } from './route/assessments-route'
import { AssessmentsResult } from './route/assessmentsResult-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: '*' })

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
app.register(teacher_Subject)

app.register(Assessments)
app.register(AssessmentsResult)

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
