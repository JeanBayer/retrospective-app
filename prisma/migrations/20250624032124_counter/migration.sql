/*
  Warnings:

  - You are about to drop the column `team_id` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `current_incident_free_days` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `incident_button_label` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `increment_button_label` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `last_incident_free_duration` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `longest_incident_free_days` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `page_title` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the `incident_records` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `counter_id` to the `goals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_team_id_fkey";

-- DropForeignKey
ALTER TABLE "incident_records" DROP CONSTRAINT "incident_records_team_id_fkey";

-- AlterTable
ALTER TABLE "goals" DROP COLUMN "team_id",
ADD COLUMN     "counter_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "current_incident_free_days",
DROP COLUMN "incident_button_label",
DROP COLUMN "increment_button_label",
DROP COLUMN "last_incident_free_duration",
DROP COLUMN "longest_incident_free_days",
DROP COLUMN "page_title";

-- DropTable
DROP TABLE "incident_records";

-- CreateTable
CREATE TABLE "counters" (
    "counter_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "current_count" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_reset_duration" INTEGER NOT NULL DEFAULT 0,
    "page_title" TEXT NOT NULL DEFAULT 'Días sin evento',
    "increment_button_label" TEXT NOT NULL DEFAULT 'Un día más',
    "reset_button_label" TEXT NOT NULL DEFAULT '¡Evento!',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counters_pkey" PRIMARY KEY ("counter_id")
);

-- CreateTable
CREATE TABLE "counter_reset_records" (
    "record_id" TEXT NOT NULL,
    "counter_id" TEXT NOT NULL,
    "count_before_reset" INTEGER NOT NULL,
    "reset_occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "counter_reset_records_pkey" PRIMARY KEY ("record_id")
);

-- AddForeignKey
ALTER TABLE "counters" ADD CONSTRAINT "counters_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "counter_reset_records" ADD CONSTRAINT "counter_reset_records_counter_id_fkey" FOREIGN KEY ("counter_id") REFERENCES "counters"("counter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_counter_id_fkey" FOREIGN KEY ("counter_id") REFERENCES "counters"("counter_id") ON DELETE RESTRICT ON UPDATE CASCADE;
