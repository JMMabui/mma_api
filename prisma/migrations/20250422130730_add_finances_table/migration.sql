/*
  Warnings:

  - You are about to drop the `Assessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assessment_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `teacher` table. All the data in the column will be lost.
  - Added the required column `semester` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_classes` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year_study` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `students_classes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_teacher` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_type` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Assessment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Schedule";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StudyMaterial";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Subjects";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "assessment_results";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "student_Subject";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "teacher_Subject";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "employeers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "job_position" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject_name" TEXT NOT NULL,
    "subject_type" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subject_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "student_subject_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_subject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "class_id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "schedule_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject_id" TEXT NOT NULL,
    "assessment_type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "assessment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assessment_result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "grade" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "assessment_result_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assessment_result_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "teacher_subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacher_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "teacher_subject_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "teacher_subject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MENSALIDADE',
    "amount" REAL NOT NULL,
    "due_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "month" INTEGER,
    "year" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "cancelled_at" DATETIME,
    "cancelled_by" TEXT,
    "cancellation_reason" TEXT,
    CONSTRAINT "invoice_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoice_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_date" DATETIME NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoice_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "invoice_history_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "late_fee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "days_late" INTEGER NOT NULL,
    "applied_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "late_fee_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payment_reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "sent_at" DATETIME NOT NULL,
    "reminder_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_reminder_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_classes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "class_name" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "year_study" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "status_classes" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "classes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_classes" ("class_name", "course_id", "created_at", "id", "updated_at") SELECT "class_name", "course_id", "created_at", "id", "updated_at" FROM "classes";
DROP TABLE "classes";
ALTER TABLE "new_classes" RENAME TO "classes";
CREATE TABLE "new_students_classes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "students_classes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "students_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_students_classes" ("class_id", "created_at", "id", "student_id", "updated_at") SELECT "class_id", "created_at", "id", "student_id", "updated_at" FROM "students_classes";
DROP TABLE "students_classes";
ALTER TABLE "new_students_classes" RENAME TO "students_classes";
CREATE TABLE "new_teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "teacher_type" TEXT NOT NULL,
    "status_teacher" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_teacher" ("contact", "created_at", "email", "id", "updated_at") SELECT "contact", "created_at", "email", "id", "updated_at" FROM "teacher";
DROP TABLE "teacher";
ALTER TABLE "new_teacher" RENAME TO "teacher";
CREATE UNIQUE INDEX "teacher_email_key" ON "teacher"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "employeers_email_key" ON "employeers"("email");
