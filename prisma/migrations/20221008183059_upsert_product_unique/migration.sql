/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `my-products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `my-products_id_productId_key` ON `my-products`;

-- CreateIndex
CREATE UNIQUE INDEX `my-products_productId_key` ON `my-products`(`productId`);
