/*
  Warnings:

  - Added the required column `retrospective_name` to the `retrospectives` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "retrospectives" ADD COLUMN     "retrospective_name" TEXT NOT NULL;
