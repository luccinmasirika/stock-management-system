-- CreateTable
CREATE TABLE `factures` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `refence` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NULL,
    `clientPhone` VARCHAR(191) NULL,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `amountPaid` DOUBLE NOT NULL DEFAULT 0,
    `amountDue` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `factures_refence_key`(`refence`),
    INDEX `factures_id_refence_idx`(`id`, `refence`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facture_products` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `factureId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `purchasedPrice` DOUBLE NOT NULL DEFAULT 0,
    `totalAmount` DOUBLE NOT NULL DEFAULT 0,

    INDEX `facture_products_id_factureId_productId_idx`(`id`, `factureId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('FINISHED', 'CANCELED') NOT NULL DEFAULT 'FINISHED',
    `factureId` VARCHAR(191) NOT NULL,

    INDEX `sales_id_factureId_userId_idx`(`id`, `factureId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `facture_products` ADD CONSTRAINT `facture_products_factureId_fkey` FOREIGN KEY (`factureId`) REFERENCES `factures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facture_products` ADD CONSTRAINT `facture_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_factureId_fkey` FOREIGN KEY (`factureId`) REFERENCES `factures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
