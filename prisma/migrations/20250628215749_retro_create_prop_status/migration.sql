-- CreateEnum
CREATE TYPE "RetrospectiveStatus" AS ENUM ('CREATED', 'CLOSED');

-- AlterTable
ALTER TABLE "retrospectives" ADD COLUMN     "status" "RetrospectiveStatus" NOT NULL DEFAULT 'CREATED';
