-- CreateTable
CREATE TABLE "counter_increment_records" (
    "increment_id" TEXT NOT NULL,
    "counter_id" TEXT NOT NULL,
    "incremented_at" DATE NOT NULL,

    CONSTRAINT "counter_increment_records_pkey" PRIMARY KEY ("increment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "counter_increment_records_counter_id_incremented_at_key" ON "counter_increment_records"("counter_id", "incremented_at");

-- AddForeignKey
ALTER TABLE "counter_increment_records" ADD CONSTRAINT "counter_increment_records_counter_id_fkey" FOREIGN KEY ("counter_id") REFERENCES "counters"("counter_id") ON DELETE RESTRICT ON UPDATE CASCADE;
