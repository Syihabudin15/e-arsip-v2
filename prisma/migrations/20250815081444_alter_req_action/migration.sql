/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `permohonanaction` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `permohonanaction` table. All the data in the column will be lost.
  - You are about to drop the column `rootFileName` on the `permohonanaction` table. All the data in the column will be lost.
  - Added the required column `action` to the `PermohonanAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `files` to the `PermohonanAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rootFilename` to the `PermohonanAction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `permohonanaction` DROP COLUMN `fileUrl`,
    DROP COLUMN `filename`,
    DROP COLUMN `rootFileName`,
    ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `files` VARCHAR(191) NOT NULL,
    ADD COLUMN `rootFilename` VARCHAR(191) NOT NULL;
