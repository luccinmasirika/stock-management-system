/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId]` on the table `my-products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `my-products_productId_userId_key` ON `my-products`(`productId`, `userId`);
