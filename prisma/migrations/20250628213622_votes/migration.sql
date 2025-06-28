/*
  Warnings:

  - You are about to drop the `_Voters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Voters" DROP CONSTRAINT "_Voters_A_fkey";

-- DropForeignKey
ALTER TABLE "_Voters" DROP CONSTRAINT "_Voters_B_fkey";

-- DropTable
DROP TABLE "_Voters";

-- CreateTable
CREATE TABLE "votes" (
    "vote_id" TEXT NOT NULL,
    "voter_id" TEXT NOT NULL,
    "retrospective_id" TEXT NOT NULL,
    "voted_for_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("vote_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "votes_voter_id_retrospective_id_key" ON "votes"("voter_id", "retrospective_id");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_retrospective_id_fkey" FOREIGN KEY ("retrospective_id") REFERENCES "retrospectives"("retrospective_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_voted_for_id_fkey" FOREIGN KEY ("voted_for_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
