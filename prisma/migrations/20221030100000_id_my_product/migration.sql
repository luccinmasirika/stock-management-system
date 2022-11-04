/*
  Warnings:

  - The primary key for the `my-products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `my-products` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `my-products` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
