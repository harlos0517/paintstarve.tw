/*
  Warnings:

  - A unique constraint covering the columns `[season,seatId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Character_season_seatId_key" ON "Character"("season", "seatId");
