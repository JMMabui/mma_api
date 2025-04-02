/*
  Warnings:

  - Added the required column `weight` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Assessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('TESTE_INDIVIDUAL', 'TESTE_GRUPO', 'TRABALHO_INDIVIDUAL', 'TRABALHO_GRUPO', 'EXAME_NORMAL', 'EXAME_RECORRENCIA', 'EXAME_ESPECIAL');

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "AssessmentType" NOT NULL;
