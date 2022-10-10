/*
  Warnings:

  - A unique constraint covering the columns `[id,productId,userId]` on the table `my-products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `my-products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `my-products` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `my-products_id_productId_userId_key` ON `my-products`(`id`, `productId`, `userId`);

-- AddForeignKey
ALTER TABLE `my-products` ADD CONSTRAINT `my-products_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
