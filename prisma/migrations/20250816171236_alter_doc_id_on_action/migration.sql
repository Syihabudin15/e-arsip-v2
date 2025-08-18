/*
  Warnings:

  - Made the column `documentId` on table `permohonanaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `permohonanaction` DROP FOREIGN KEY `PermohonanAction_documentId_fkey`;

-- DropIndex
DROP INDEX `PermohonanAction_documentId_fkey` ON `permohonanaction`;

-- AlterTable
ALTER TABLE `permohonanaction` MODIFY `documentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PermohonanAction` ADD CONSTRAINT `PermohonanAction_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
