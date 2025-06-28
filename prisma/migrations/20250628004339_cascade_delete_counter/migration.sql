-- DropForeignKey
ALTER TABLE "counter_increment_records" DROP CONSTRAINT "counter_increment_records_counter_id_fkey";

-- DropForeignKey
ALTER TABLE "counter_reset_records" DROP CONSTRAINT "counter_reset_records_counter_id_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_counter_id_fkey";

-- AddForeignKey
ALTER TABLE "counter_increment_records" ADD CONSTRAINT "counter_increment_records_counter_id_fkey" FOREIGN KEY ("counter_id") REFERENCES "counters"("counter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "counter_reset_records" ADD CONSTRAINT "counter_reset_records_counter_id_fkey" FOREIGN KEY ("counter_id") REFERENCES "counters"("counter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_counter_id_fkey" FOREIGN KEY ("counter_id") REFERENCES "counters"("counter_id") ON DELETE CASCADE ON UPDATE CASCADE;
