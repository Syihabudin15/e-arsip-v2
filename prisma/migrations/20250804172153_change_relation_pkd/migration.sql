/*
  Warnings:

  - Added the required column `documentId` to the `PermohonanKredit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_permohonanKreditId_fkey`;

-- DropIndex
DROP INDEX `Document_permohonanKreditId_fkey` ON `document`;

-- AlterTable
ALTER TABLE `permohonankredit` ADD COLUMN `documentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PermohonanKredit` ADD CONSTRAINT `PermohonanKredit_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
