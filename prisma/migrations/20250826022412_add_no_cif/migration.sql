/*
  Warnings:

  - A unique constraint covering the columns `[noCIF]` on the table `Pemohon` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Pemohon_accountNumber_key` ON `pemohon`;

-- AlterTable
ALTER TABLE `pemohon` ADD COLUMN `noCIF` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `accountNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pemohon_noCIF_key` ON `Pemohon`(`noCIF`);
