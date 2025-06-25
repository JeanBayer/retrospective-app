/*
  Warnings:

  - You are about to drop the column `status` on the `team_memberships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "team_memberships" DROP COLUMN "status";

-- DropEnum
DROP TYPE "MembershipStatus";
