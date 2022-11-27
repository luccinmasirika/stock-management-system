/*
  Warnings:

  - You are about to drop the column `refence` on the `factures` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `factures` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference` to the `factures` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `factures_id_refence_idx` ON `factures`;

-- DropIndex
DROP INDEX `factures_refence_key` ON `factures`;

-- AlterTable
ALTER TABLE `factures` DROP COLUMN `refence`,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `factures_reference_key` ON `factures`(`reference`);

-- CreateIndex
CREATE INDEX `factures_id_reference_idx` ON `factures`(`id`, `reference`);
