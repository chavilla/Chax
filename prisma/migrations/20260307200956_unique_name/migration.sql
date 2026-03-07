/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Product_name_organizationId_key` ON `Product`(`name`, `organizationId`);
