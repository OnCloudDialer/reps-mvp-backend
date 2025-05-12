-- CreateTable
CREATE TABLE `StoreNotes` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `noteId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StoreNotes` ADD CONSTRAINT `StoreNotes_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreNotes` ADD CONSTRAINT `StoreNotes_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Notes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
