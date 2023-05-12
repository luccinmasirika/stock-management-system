-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `factureId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,

    INDEX `payments_id_factureId_idx`(`id`, `factureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_factureId_fkey` FOREIGN KEY (`factureId`) REFERENCES `factures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
