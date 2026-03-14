-- AlterTable
ALTER TABLE `CashSession` ADD COLUMN `totalCard` DECIMAL(12, 2) NULL,
    ADD COLUMN `totalCash` DECIMAL(12, 2) NULL,
    ADD COLUMN `totalTransfer` DECIMAL(12, 2) NULL;

-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `dv` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `parentInvoiceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `InvoiceItem` ADD COLUMN `taxDianCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `InvoiceResolution` ADD COLUMN `name` VARCHAR(191) NULL,
    MODIFY `resolutionNumber` VARCHAR(191) NULL,
    MODIFY `startDate` DATETIME(3) NULL,
    MODIFY `endDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `dv` VARCHAR(191) NULL,
    ADD COLUMN `usesDian` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Product` MODIFY `taxType` ENUM('IVA', 'IC', 'ICA', 'INC', 'EXCLUIDO', 'EXENTO', 'RETEIVA', 'RETEFUENTE') NOT NULL DEFAULT 'EXCLUIDO';

-- CreateTable
CREATE TABLE `ProductTax` (
    `id` VARCHAR(191) NOT NULL,
    `taxType` ENUM('IVA', 'IC', 'ICA', 'INC', 'EXCLUIDO', 'EXENTO', 'RETEIVA', 'RETEFUENTE') NOT NULL,
    `percentage` DECIMAL(5, 2) NOT NULL,
    `fixedAmount` DECIMAL(12, 2) NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductTax_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItemTax` (
    `id` VARCHAR(191) NOT NULL,
    `dianCode` VARCHAR(191) NOT NULL,
    `taxBase` DECIMAL(12, 2) NOT NULL,
    `taxPercentage` DECIMAL(5, 2) NOT NULL,
    `taxAmount` DECIMAL(12, 2) NOT NULL,
    `invoiceItemId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InvoiceItemTax_invoiceItemId_idx`(`invoiceItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Invoice_organizationId_issueDate_idx` ON `Invoice`(`organizationId`, `issueDate`);

-- CreateIndex
CREATE INDEX `Invoice_parentInvoiceId_idx` ON `Invoice`(`parentInvoiceId`);

-- AddForeignKey
ALTER TABLE `ProductTax` ADD CONSTRAINT `ProductTax_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_parentInvoiceId_fkey` FOREIGN KEY (`parentInvoiceId`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItemTax` ADD CONSTRAINT `InvoiceItemTax_invoiceItemId_fkey` FOREIGN KEY (`invoiceItemId`) REFERENCES `InvoiceItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
