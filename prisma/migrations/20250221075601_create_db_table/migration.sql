-- CreateEnum
CREATE TYPE "LevelCourse" AS ENUM ('CURTA_DURACAO', 'TECNICO_MEDIO', 'LICENCIATURA', 'RELIGIOSO', 'MESTRADO');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('LABORAL', 'POS_LABORAL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO');

-- CreateEnum
CREATE TYPE "ProvincyAddress" AS ENUM ('MAPUTO_CIDADE', 'MAPUTO_PROVINCIA', 'GAZA', 'INHAMBANE', 'MANICA', 'SOFALA', 'TETE', 'ZAMBEZIA', 'NAMPULA', 'CABO_DELGADO', 'NIASSA');

-- CreateEnum
CREATE TYPE "PreLevel" AS ENUM ('CLASSE_10', 'CLASSE_12', 'LICENCIATURA');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('BI', 'PASSAPORTE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'TRANCADO', 'INSCRITO', 'NAO_INSCRITO');

-- CreateEnum
CREATE TYPE "DisciplineType" AS ENUM ('COMPLEMENTAR', 'NUCLEAR');

-- CreateEnum
CREATE TYPE "YearStudy" AS ENUM ('PRIMEIRO_ANO', 'SEGUNDO_ANO', 'TERCEIRO_ANO', 'QUARTO_ANO');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('PRIMEIRO_SEMESTRE', 'SEGUNDO_SEMESTRE');

-- CreateTable
CREATE TABLE "login_data" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "login_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "place_of_birth" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "marital_status" "MaritalStatus" NOT NULL,
    "provincy_address" "ProvincyAddress" NOT NULL,
    "address" TEXT NOT NULL,
    "father_name" TEXT NOT NULL,
    "mother_name" TEXT NOT NULL,
    "document_type" "Type" NOT NULL,
    "document_number" TEXT NOT NULL,
    "document_issued_at" TIMESTAMP(3) NOT NULL,
    "document_expired_at" TIMESTAMP(3) NOT NULL,
    "nuit" INTEGER NOT NULL,
    "education_officer_id" TEXT,
    "login_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_school" (
    "id" TEXT NOT NULL,
    "school_level" "PreLevel" NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_provincy" "ProvincyAddress" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "pre_school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_officer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "data_of_birth" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "contact" TEXT NOT NULL,
    "provincy_address" "ProvincyAddress" NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_officer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_description" TEXT,
    "course_duration" INTEGER NOT NULL,
    "level_course" "LevelCourse" NOT NULL,
    "period" "Period" NOT NULL,
    "total_vacancies" INTEGER NOT NULL,
    "available_vacancies" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "registration_status" "Status" NOT NULL DEFAULT 'PENDENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplines" (
    "codigo" TEXT NOT NULL,
    "discipline_name" TEXT NOT NULL,
    "year_study" "YearStudy" NOT NULL,
    "semester" "Semester" NOT NULL,
    "hcs" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "discipline_type" "DisciplineType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "teacherId" TEXT,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "student_discipline" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NAO_INSCRITO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "student_discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "data_of_birth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "provincy_address" "ProvincyAddress" NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_data_email_key" ON "login_data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_nuit_key" ON "student"("nuit");

-- CreateIndex
CREATE UNIQUE INDEX "student_login_id_key" ON "student"("login_id");

-- CreateIndex
CREATE UNIQUE INDEX "education_officer_email_key" ON "education_officer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_email_key" ON "teacher"("email");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_login_id_fkey" FOREIGN KEY ("login_id") REFERENCES "login_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_education_officer_id_fkey" FOREIGN KEY ("education_officer_id") REFERENCES "education_officer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_school" ADD CONSTRAINT "pre_school_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration" ADD CONSTRAINT "registration_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration" ADD CONSTRAINT "registration_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_discipline" ADD CONSTRAINT "student_discipline_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_discipline" ADD CONSTRAINT "student_discipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
