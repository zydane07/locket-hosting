/*
  Warnings:

  - You are about to drop the column `precondition` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `precondition`;

-- CreateTable
CREATE TABLE `EventPreconditionDescription` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `event_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventPreconditionDescription` ADD CONSTRAINT `EventPreconditionDescription_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
