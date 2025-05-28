/*
  Warnings:

  - You are about to alter the column `default_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Int`.
  - You are about to alter the column `regular_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Int`.
  - You are about to alter the column `special_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `default_price` INTEGER NOT NULL,
    MODIFY `regular_price` INTEGER NOT NULL,
    MODIFY `special_price` INTEGER NULL;
