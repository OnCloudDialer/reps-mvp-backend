/*
  Warnings:

  - The values [flat_discount,buy_x_get_y,bundle,free_gift] on the enum `Promotion_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Promotion` MODIFY `type` ENUM('FLAT_DISCOUNT', 'BUY_X_GET_Y', 'BUNDLE', 'FREE_GIFT') NOT NULL;
