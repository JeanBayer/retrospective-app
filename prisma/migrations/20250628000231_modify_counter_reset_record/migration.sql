/*
  Warnings:

  - A unique constraint covering the columns `[counter_id,reset_occurred_at]` on the table `counter_reset_records` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_reset_event` to the `counter_reset_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "counter_reset_records" ADD COLUMN     "name_reset_event" TEXT NOT NULL,
ALTER COLUMN "reset_occurred_at" DROP DEFAULT,
ALTER COLUMN "reset_occurred_at" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "counter_reset_records_counter_id_reset_occurred_at_key" ON "counter_reset_records"("counter_id", "reset_occurred_at");
