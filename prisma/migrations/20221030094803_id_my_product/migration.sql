/*
  Warnings:

  - The primary key for the `my-products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `my-products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `my-products_productId_userId_key` ON `my-products`;

-- AlterTable
ALTER TABLE `my-products` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`productId`, `userId`);
