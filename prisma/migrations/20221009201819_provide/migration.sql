/*
  Warnings:

  - You are about to drop the column `userId` on the `provide` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `Provide` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `provide` DROP FOREIGN KEY `Provide_userId_fkey`;

-- AlterTable
ALTER TABLE `provide` DROP COLUMN `userId`,
    ADD COLUMN `providerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Provide` ADD CONSTRAINT `Provide_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
