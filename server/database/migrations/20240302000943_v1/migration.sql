/*
  Warnings:

  - You are about to drop the column `name` on the `Business` table. All the data in the column will be lost.
  - Added the required column `businessName` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Business" ("createdAt", "email", "emailNormalized", "id", "password", "phoneNumber", "updatedAt") SELECT "createdAt", "email", "emailNormalized", "id", "password", "phoneNumber", "updatedAt" FROM "Business";
DROP TABLE "Business";
ALTER TABLE "new_Business" RENAME TO "Business";
CREATE UNIQUE INDEX "Business_businessName_key" ON "Business"("businessName");
CREATE UNIQUE INDEX "Business_email_key" ON "Business"("email");
CREATE UNIQUE INDEX "Business_emailNormalized_key" ON "Business"("emailNormalized");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
