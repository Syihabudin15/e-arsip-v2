/*
  Warnings:

  - You are about to drop the column `purposeUse` on the `pemohon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pemohon` DROP COLUMN `purposeUse`;

-- AlterTable
ALTER TABLE `permohonan` ADD COLUMN `purposeUse` VARCHAR(191) NULL;
