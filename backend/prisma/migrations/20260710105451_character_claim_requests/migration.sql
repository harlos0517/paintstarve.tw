-- CreateEnum
CREATE TYPE "CharacterClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_userId_fkey";

-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Work" ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "CharacterClaimRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "status" "CharacterClaimStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "CharacterClaimRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterClaimRequest_userId_characterId_key" ON "CharacterClaimRequest"("userId", "characterId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterClaimRequest" ADD CONSTRAINT "CharacterClaimRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterClaimRequest" ADD CONSTRAINT "CharacterClaimRequest_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
