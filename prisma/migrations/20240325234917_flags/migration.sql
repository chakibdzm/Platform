/*
  Warnings:

  - You are about to drop the column `flag` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "flag",
DROP COLUMN "point",
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "total_points" INTEGER;

-- CreateTable
CREATE TABLE "Flag" (
    "id" SERIAL NOT NULL,
    "key" TEXT,
    "points" INTEGER DEFAULT 500,
    "challengeId" INTEGER NOT NULL,

    CONSTRAINT "Flag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
