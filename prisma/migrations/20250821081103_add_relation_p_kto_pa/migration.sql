-- AlterTable
ALTER TABLE `permohonanaction` ADD COLUMN `permohonanKreditId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `PermohonanAction` ADD CONSTRAINT `PermohonanAction_permohonanKreditId_fkey` FOREIGN KEY (`permohonanKreditId`) REFERENCES `PermohonanKredit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
