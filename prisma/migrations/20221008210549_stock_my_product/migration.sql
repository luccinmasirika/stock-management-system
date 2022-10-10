/*
  Warnings:

  - You are about to drop the column `quantity` on the `my-products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `my-products` DROP COLUMN `quantity`,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0;
