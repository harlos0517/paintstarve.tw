-- CreateEnum
CREATE TYPE "CharacterIdCardDisplayMode" AS ENUM ('SINGLE', 'CAROUSEL');

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "idCardDisplayMode" "CharacterIdCardDisplayMode" NOT NULL DEFAULT 'SINGLE',
ADD COLUMN     "primaryIdCardImageId" TEXT;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_primaryIdCardImageId_fkey" FOREIGN KEY ("primaryIdCardImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
