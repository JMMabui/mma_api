-- CreateEnum
CREATE TYPE "StatusTeacher" AS ENUM ('ATIVO', 'INATIVO');

-- AlterTable
ALTER TABLE "teacher_discipline" ADD COLUMN     "status" "StatusTeacher" NOT NULL DEFAULT 'INATIVO';
