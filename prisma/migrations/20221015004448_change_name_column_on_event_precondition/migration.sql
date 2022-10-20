/*
  Warnings:

  - You are about to drop the column `event_participant_description_id` on the `eventprecondition` table. All the data in the column will be lost.
  - Added the required column `event_precondition_description_id` to the `EventPrecondition` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `eventprecondition` DROP FOREIGN KEY `EventPrecondition_event_participant_description_id_fkey`;

-- AlterTable
ALTER TABLE `eventprecondition` DROP COLUMN `event_participant_description_id`,
    ADD COLUMN `event_precondition_description_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `EventPrecondition` ADD CONSTRAINT `EventPrecondition_event_precondition_description_id_fkey` FOREIGN KEY (`event_precondition_description_id`) REFERENCES `EventPreconditionDescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
