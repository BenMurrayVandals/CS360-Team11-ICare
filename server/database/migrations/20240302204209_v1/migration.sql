-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userType" TEXT NOT NULL DEFAULT 'business',
    "businessName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Business" ("businessName", "createdAt", "email", "emailNormalized", "id", "password", "phoneNumber", "updatedAt") SELECT "businessName", "createdAt", "email", "emailNormalized", "id", "password", "phoneNumber", "updatedAt" FROM "Business";
DROP TABLE "Business";
ALTER TABLE "new_Business" RENAME TO "Business";
CREATE UNIQUE INDEX "Business_businessName_key" ON "Business"("businessName");
CREATE UNIQUE INDEX "Business_email_key" ON "Business"("email");
CREATE UNIQUE INDEX "Business_emailNormalized_key" ON "Business"("emailNormalized");
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userType" TEXT NOT NULL DEFAULT 'customer',
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("createdAt", "email", "emailNormalized", "firstName", "id", "lastName", "password", "phoneNumber", "updatedAt", "username") SELECT "createdAt", "email", "emailNormalized", "firstName", "id", "lastName", "password", "phoneNumber", "updatedAt", "username" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_username_key" ON "Customer"("username");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "Customer_emailNormalized_key" ON "Customer"("emailNormalized");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
