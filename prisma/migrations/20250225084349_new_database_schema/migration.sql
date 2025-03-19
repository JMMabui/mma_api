/*
  Warnings:

  - You are about to drop the column `teacherId` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `data_of_birth` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `provincy_address` on the `teacher` table. All the data in the column will be lost.
  - Changed the type of `document_type` on the `student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `type` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BI', 'PASSAPORTE');

-- CreateEnum
CREATE TYPE "StatusClasses" AS ENUM ('EM_ATIVIDADE', 'DESATIVADO');

-- CreateEnum
CREATE TYPE "TeacherType" AS ENUM ('COORDENADOR', 'DOCENTE', 'AUXILIAR');

-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_teacherId_fkey";

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "document_type",
ADD COLUMN     "document_type" "DocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "teacher" DROP COLUMN "address",
DROP COLUMN "data_of_birth",
DROP COLUMN "provincy_address",
ADD COLUMN     "type" "TeacherType" NOT NULL;

-- DropEnum
DROP TYPE "Type";

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StatusClasses" NOT NULL DEFAULT 'DESATIVADO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_discipline" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "teacher_discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students_classes" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "students_classes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_discipline" ADD CONSTRAINT "teacher_discipline_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_discipline" ADD CONSTRAINT "teacher_discipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students_classes" ADD CONSTRAINT "students_classes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students_classes" ADD CONSTRAINT "students_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
