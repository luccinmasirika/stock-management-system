/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `facture_products` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `factures` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `facture_products` DROP COLUMN `totalAmount`;

-- AlterTable
ALTER TABLE `factures` DROP COLUMN `total`,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL DEFAULT 0;
