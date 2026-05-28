-- Plan §1.5: rename role→defaultView, add teacherStatus, add Class + ClassMembership.

-- CreateEnum
CREATE TYPE "DefaultView" AS ENUM ('TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "TeacherStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED');

-- CreateEnum
CREATE TYPE "DiscoveryStatus" AS ENUM ('PRIVATE', 'PENDING_REVIEW', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'REMOVED');

-- Add new User columns (nullable first so data migration works)
ALTER TABLE "User" ADD COLUMN "defaultView" "DefaultView";
ALTER TABLE "User" ADD COLUMN "teacherStatus" "TeacherStatus" NOT NULL DEFAULT 'UNVERIFIED';

-- Copy role → defaultView (ADMIN collapses to STUDENT — admin role retired per plan)
UPDATE "User" SET "defaultView" = 'TEACHER' WHERE "role" = 'TEACHER';
UPDATE "User" SET "defaultView" = 'STUDENT' WHERE "role" IN ('STUDENT', 'ADMIN') OR "role" IS NULL;

-- Make NOT NULL with default
ALTER TABLE "User" ALTER COLUMN "defaultView" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "defaultView" SET DEFAULT 'STUDENT';

-- Drop old role column + enum
ALTER TABLE "User" DROP COLUMN "role";
DROP TYPE "Role";

-- CreateTable Class
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "inviteCode" TEXT NOT NULL,
    "inviteCodeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "discoveryStatus" "DiscoveryStatus" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_inviteCode_key" ON "Class"("inviteCode");
CREATE INDEX "Class_ownerId_idx" ON "Class"("ownerId");
CREATE INDEX "Class_inviteCode_idx" ON "Class"("inviteCode");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable ClassMembership
CREATE TABLE "ClassMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassMembership_userId_classId_key" ON "ClassMembership"("userId", "classId");
CREATE INDEX "ClassMembership_classId_status_idx" ON "ClassMembership"("classId", "status");
CREATE INDEX "ClassMembership_userId_status_idx" ON "ClassMembership"("userId", "status");

-- AddForeignKey
ALTER TABLE "ClassMembership" ADD CONSTRAINT "ClassMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClassMembership" ADD CONSTRAINT "ClassMembership_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
