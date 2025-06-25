-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "team_memberships" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';
