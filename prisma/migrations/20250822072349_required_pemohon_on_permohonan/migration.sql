/*
  Warnings:

  - Made the column `pemohonId` on table `permohonan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `permohonan` DROP FOREIGN KEY `Permohonan_pemohonId_fkey`;

-- AlterTable
ALTER TABLE `permohonan` MODIFY `pemohonId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Permohonan` ADD CONSTRAINT `Permohonan_pemohonId_fkey` FOREIGN KEY (`pemohonId`) REFERENCES `Pemohon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
