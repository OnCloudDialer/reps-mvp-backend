/*
  Warnings:

  - Added the required column `coords` to the `AreaTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AreaTag` ADD COLUMN `coords` JSON NOT NULL;
