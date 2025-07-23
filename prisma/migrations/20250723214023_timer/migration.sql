-- CreateTable
CREATE TABLE "timers" (
    "timer_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timers_pkey" PRIMARY KEY ("timer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timers_team_id_key" ON "timers"("team_id");

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;
