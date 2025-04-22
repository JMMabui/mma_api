-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MENSALIDADE',
    "amount" REAL NOT NULL,
    "due_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "month" TEXT,
    "year" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "cancelled_at" DATETIME,
    "cancelled_by" TEXT,
    "cancellation_reason" TEXT,
    CONSTRAINT "invoice_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoice_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_invoice" ("amount", "cancellation_reason", "cancelled_at", "cancelled_by", "course_id", "created_at", "due_date", "id", "month", "status", "student_id", "type", "updated_at", "year") SELECT "amount", "cancellation_reason", "cancelled_at", "cancelled_by", "course_id", "created_at", "due_date", "id", "month", "status", "student_id", "type", "updated_at", "year" FROM "invoice";
DROP TABLE "invoice";
ALTER TABLE "new_invoice" RENAME TO "invoice";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
