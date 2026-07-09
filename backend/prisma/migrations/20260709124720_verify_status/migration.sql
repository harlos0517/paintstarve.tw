/*
  Warnings:

  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserVerifiedStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "verified",
ADD COLUMN     "verifyStatus" "UserVerifiedStatus" NOT NULL DEFAULT 'PENDING';
