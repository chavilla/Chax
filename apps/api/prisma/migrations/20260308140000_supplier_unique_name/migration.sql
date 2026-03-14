-- CreateIndex: razón social (name) única por organización
CREATE UNIQUE INDEX `Supplier_name_organizationId_key` ON `Supplier`(`name`, `organizationId`);
