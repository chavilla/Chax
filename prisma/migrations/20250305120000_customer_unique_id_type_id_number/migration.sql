-- DropIndex: identificación ya no es solo (idNumber, organizationId)
DROP INDEX `Customer_idNumber_organizationId_key` ON `Customer`;

-- CreateIndex: identificación única por (idType, idNumber, organizationId)
CREATE UNIQUE INDEX `Customer_idType_idNumber_organizationId_key` ON `Customer`(`idType`, `idNumber`, `organizationId`);
