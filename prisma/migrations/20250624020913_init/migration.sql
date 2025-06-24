-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "sprint_wins" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "teams" (
    "team_id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "hashed_join_password" TEXT NOT NULL,
    "current_incident_free_days" INTEGER NOT NULL DEFAULT 0,
    "longest_incident_free_days" INTEGER NOT NULL DEFAULT 0,
    "last_incident_free_duration" INTEGER NOT NULL DEFAULT 0,
    "page_title" TEXT NOT NULL DEFAULT 'Días sin Incidente en Producción',
    "increment_button_label" TEXT NOT NULL DEFAULT 'Un día más sin incidente',
    "incident_button_label" TEXT NOT NULL DEFAULT '¡Incidente!',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "team_memberships" (
    "membership_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_memberships_pkey" PRIMARY KEY ("membership_id")
);

-- CreateTable
CREATE TABLE "goals" (
    "goal_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target_days" INTEGER NOT NULL,
    "achieved" BOOLEAN NOT NULL DEFAULT false,
    "achieved_at" TIMESTAMP(3),
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("goal_id")
);

-- CreateTable
CREATE TABLE "incident_records" (
    "record_id" TEXT NOT NULL,
    "days_before_incident" INTEGER NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "team_id" TEXT NOT NULL,

    CONSTRAINT "incident_records_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "retrospectives" (
    "retrospective_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "retrospective_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sprint_winner_id" TEXT,

    CONSTRAINT "retrospectives_pkey" PRIMARY KEY ("retrospective_id")
);

-- CreateTable
CREATE TABLE "thank_yous" (
    "thank_you_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "giver_id" TEXT NOT NULL,
    "receiver_id" TEXT,
    "retrospective_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "thank_yous_pkey" PRIMARY KEY ("thank_you_id")
);

-- CreateTable
CREATE TABLE "_Voters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Voters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_name_key" ON "teams"("team_name");

-- CreateIndex
CREATE UNIQUE INDEX "team_memberships_user_id_team_id_key" ON "team_memberships"("user_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "retrospectives_team_id_retrospective_number_key" ON "retrospectives"("team_id", "retrospective_number");

-- CreateIndex
CREATE INDEX "_Voters_B_index" ON "_Voters"("B");

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_records" ADD CONSTRAINT "incident_records_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retrospectives" ADD CONSTRAINT "retrospectives_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retrospectives" ADD CONSTRAINT "retrospectives_sprint_winner_id_fkey" FOREIGN KEY ("sprint_winner_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thank_yous" ADD CONSTRAINT "thank_yous_giver_id_fkey" FOREIGN KEY ("giver_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thank_yous" ADD CONSTRAINT "thank_yous_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thank_yous" ADD CONSTRAINT "thank_yous_retrospective_id_fkey" FOREIGN KEY ("retrospective_id") REFERENCES "retrospectives"("retrospective_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Voters" ADD CONSTRAINT "_Voters_A_fkey" FOREIGN KEY ("A") REFERENCES "retrospectives"("retrospective_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Voters" ADD CONSTRAINT "_Voters_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
