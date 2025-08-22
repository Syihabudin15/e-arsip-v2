/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber]` on the table `Pemohon` will be added. If there are existing duplicate values, this will fail.
  - Made the column `accountNumber` on table `pemohon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `pemohon` MODIFY `accountNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pemohon_accountNumber_key` ON `Pemohon`(`accountNumber`);
