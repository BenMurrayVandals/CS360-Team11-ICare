-- CreateTable
CREATE TABLE "CustomerLawn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Lawn',
    "customerId" TEXT NOT NULL,
    "lawnSize" REAL NOT NULL,
    "costPerMonth" REAL NOT NULL,
    CONSTRAINT "CustomerLawn_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BusinessLawn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Lawn',
    "businessId" TEXT NOT NULL,
    "costPerSqFoot" REAL NOT NULL,
    CONSTRAINT "BusinessLawn_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerInterior" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Interior',
    "customerId" TEXT NOT NULL,
    "sqFootage" REAL NOT NULL,
    "costPerMonth" REAL NOT NULL,
    CONSTRAINT "CustomerInterior_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BusinessInterior" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Interior',
    "businessId" TEXT NOT NULL,
    "costPerSqFoot" REAL NOT NULL,
    CONSTRAINT "BusinessInterior_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerMorgage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Morgage',
    "customerId" TEXT NOT NULL,
    "sqFootage" REAL NOT NULL,
    "costPerMonth" REAL NOT NULL,
    "insuranceRate" REAL NOT NULL,
    CONSTRAINT "CustomerMorgage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BusinessMorgage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Morgage',
    "businessId" TEXT NOT NULL,
    "costPerSqFoot" REAL NOT NULL,
    "insuranceRate" REAL NOT NULL,
    CONSTRAINT "BusinessMorgage_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerInsurance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Insurance',
    "customerId" TEXT NOT NULL,
    "sqFootage" REAL NOT NULL,
    "totalCoverage" REAL NOT NULL,
    "costPerMonth" REAL NOT NULL,
    "allowLessCoverage" BOOLEAN NOT NULL,
    CONSTRAINT "CustomerInsurance_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BusinessInsurance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Insurance',
    "businessId" TEXT NOT NULL,
    "costPerSqFoot" REAL NOT NULL,
    "totalCoverage" REAL NOT NULL,
    CONSTRAINT "BusinessInsurance_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerInternet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Internet',
    "customerId" TEXT NOT NULL,
    "speed" REAL NOT NULL,
    "costPerMonth" REAL NOT NULL,
    "allowLessSpeed" BOOLEAN NOT NULL,
    CONSTRAINT "CustomerInternet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BusinessInternet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Internet',
    "businessId" TEXT NOT NULL,
    "costPerMonth" REAL NOT NULL,
    "speed" REAL NOT NULL,
    CONSTRAINT "BusinessInternet_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerCell" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Cell',
    "customerId" TEXT NOT NULL,
    "GBPerMonth" REAL NOT NULL,
    "costPerMonth" REAL NOT NULL,
    "allowLessGB" BOOLEAN NOT NULL,
    CONSTRAINT "CustomerCell_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BusinessCell" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceType" TEXT NOT NULL DEFAULT 'Cell',
    "businessId" TEXT NOT NULL,
    "costPerMonth" REAL NOT NULL,
    "GBPerMonth" REAL NOT NULL,
    CONSTRAINT "BusinessCell_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Matched" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "cserivceId" TEXT NOT NULL,
    "bserviceId" TEXT NOT NULL,
    "matchScore" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "acceptStatus" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Matched_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Matched_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchedId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerAccept" BOOLEAN NOT NULL,
    "businessAccept" BOOLEAN NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_matchedId_fkey" FOREIGN KEY ("matchedId") REFERENCES "Matched" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Blocked" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "blockDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Blocked_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Blocked_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userType" TEXT NOT NULL DEFAULT 'customer',
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "matchPreference" REAL NOT NULL DEFAULT 50,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("createdAt", "email", "emailNormalized", "firstName", "id", "lastName", "password", "phoneNumber", "updatedAt", "userType", "username") SELECT "createdAt", "email", "emailNormalized", "firstName", "id", "lastName", "password", "phoneNumber", "updatedAt", "userType", "username" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_username_key" ON "Customer"("username");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "Customer_emailNormalized_key" ON "Customer"("emailNormalized");
CREATE UNIQUE INDEX "Customer_address_key" ON "Customer"("address");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "CustomerLawn_customerId_key" ON "CustomerLawn"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerInterior_customerId_key" ON "CustomerInterior"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerMorgage_customerId_key" ON "CustomerMorgage"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerInsurance_customerId_key" ON "CustomerInsurance"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerInternet_customerId_key" ON "CustomerInternet"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCell_customerId_key" ON "CustomerCell"("customerId");
