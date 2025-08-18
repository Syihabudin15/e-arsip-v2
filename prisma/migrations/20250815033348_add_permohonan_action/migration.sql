/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `activity` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `permohonankredit` table. All the data in the column will be lost.
  - Added the required column `permohonanKreditId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PermohonanKredit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_userId_fkey`;

-- DropForeignKey
ALTER TABLE `permohonankredit` DROP FOREIGN KEY `PermohonanKredit_documentId_fkey`;

-- DropIndex
DROP INDEX `Document_userId_idx` ON `document`;

-- DropIndex
DROP INDEX `PermohonanKredit_documentId_idx` ON `permohonankredit`;

-- AlterTable
ALTER TABLE `document` DROP COLUMN `accountNumber`,
    DROP COLUMN `activity`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `description`,
    DROP COLUMN `fullname`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `permohonanKreditId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `permohonankredit` DROP COLUMN `documentId`,
    ADD COLUMN `accountNumber` VARCHAR(191) NULL,
    ADD COLUMN `activity` TEXT NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `PermohonanAction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rootFileName` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `statusAction` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `description` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `requesterId` INTEGER NOT NULL,
    `approverId` INTEGER NULL,
    `documentId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Document_permohonanKreditId_idx` ON `Document`(`permohonanKreditId`);

-- CreateIndex
CREATE INDEX `PermohonanKredit_userId_idx` ON `PermohonanKredit`(`userId`);

-- AddForeignKey
ALTER TABLE `PermohonanKredit` ADD CONSTRAINT `PermohonanKredit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_permohonanKreditId_fkey` FOREIGN KEY (`permohonanKreditId`) REFERENCES `PermohonanKredit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermohonanAction` ADD CONSTRAINT `PermohonanAction_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermohonanAction` ADD CONSTRAINT `PermohonanAction_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermohonanAction` ADD CONSTRAINT `PermohonanAction_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
