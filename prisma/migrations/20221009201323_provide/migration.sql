/*
  Warnings:

  - You are about to drop the `providerecipient` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipientId` to the `Provide` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `providerecipient` DROP FOREIGN KEY `ProvideRecipient_provideId_fkey`;

-- DropForeignKey
ALTER TABLE `providerecipient` DROP FOREIGN KEY `ProvideRecipient_userId_fkey`;

-- AlterTable
ALTER TABLE `provide` ADD COLUMN `recipientId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `providerecipient`;

-- AddForeignKey
ALTER TABLE `Provide` ADD CONSTRAINT `Provide_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
