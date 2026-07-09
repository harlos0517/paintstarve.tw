-- CreateEnum
CREATE TYPE "WorkVerifiedStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "Work" ADD COLUMN     "verifyStatus" "WorkVerifiedStatus" NOT NULL DEFAULT 'PENDING';
