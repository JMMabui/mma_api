-- CreateEnum
CREATE TYPE "Result" AS ENUM ('APROVADO', 'REPROVADO');

-- AlterTable
ALTER TABLE "student_discipline" ADD COLUMN     "result" "Result" NOT NULL DEFAULT 'REPROVADO';
