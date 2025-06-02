/*
  Warnings:

  - You are about to drop the column `orderId` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Visit` DROP COLUMN `orderId`,
    ADD COLUMN `organizationId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
