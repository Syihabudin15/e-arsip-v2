/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `pemohon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pemohon` DROP COLUMN `accountNumber`;

-- AlterTable
ALTER TABLE `permohonan` ADD COLUMN `accountNumber` VARCHAR(191) NULL;
