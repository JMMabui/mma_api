# MMA API - Academic Management System

A comprehensive API for managing academic institutions, built with Fastify, TypeScript, and Prisma.

## Features

- **Student Management**
  - Student registration and profile management
  - Student login system
  - Course enrollment and tracking

- **Course Management**
  - Course creation and management
  - Subject management
  - Course enrollment tracking
  - Vacancy management

- **Teacher Management**
  - Teacher registration and profiles
  - Subject assignment
  - Course assignment

- **Academic Management**
  - Assessment management
  - Grade tracking
  - Subject management
  - Academic records

- **Financial Management**
  - Invoice generation and management
  - Payment processing
  - Late fee calculation
  - Payment reminders
  - Financial history tracking

## Tech Stack

- **Backend Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Zod

## Prerequisites

- Node.js >= 20.0.0
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd mma_api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mma_db"
JWT_SECRET="your-jwt-secret"
PORT=3333
ALLOWED_ORIGINS="http://localhost:5173"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Documentation

Once the server is running, you can access the API documentation at:
```
http://localhost:3333/docs
```

## API Endpoints

### Authentication
- `POST /signup` - Create new user account
- `POST /login` - User login

### Students
- `POST /students` - Create new student
- `GET /students` - List all students
- `GET /students/:id` - Get student details

### Courses
- `POST /courses` - Create new course
- `GET /course` - List all courses
- `GET /course/:id` - Get course details
- `GET /course-student/:id` - Get students in a course

### Subjects
- `POST /subjects` - Create new subject
- `GET /subjects` - List all subjects
- `GET /subjects/:id` - Get subject details

### Financial
- `POST /invoice` - Create new invoice
- `GET /invoice/:id` - Get invoice details
- `POST /payment` - Record payment
- `POST /late-fee` - Add late fee
- `POST /payment-reminder` - Create payment reminder

### Academic
- `POST /assessment` - Create assessment
- `GET /assessment/:id` - Get assessment details
- `POST /assessment-result` - Record assessment results

## CORS Configuration

The API is configured with CORS to allow requests from specified origins. By default, it allows requests from:
- `http://localhost:5173`

To modify allowed origins, update the `ALLOWED_ORIGINS` environment variable:
```env
ALLOWED_ORIGINS="http://localhost:5173,https://yourdomain.com"
```

## Error Handling

The API uses a consistent error response format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message (if available)",
  "data": null
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 