-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `Files_permohonanKreditId_fkey`;

-- DropIndex
DROP INDEX `Files_permohonanKreditId_fkey` ON `files`;

-- AlterTable
ALTER TABLE `files` MODIFY `permohonanKreditId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_permohonanKreditId_fkey` FOREIGN KEY (`permohonanKreditId`) REFERENCES `PermohonanKredit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
