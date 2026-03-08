-- CreateIndex: contactName único por organización (varios NULL permitidos)
CREATE UNIQUE INDEX `Supplier_contactName_organizationId_key` ON `Supplier`(`contactName`, `organizationId`);
