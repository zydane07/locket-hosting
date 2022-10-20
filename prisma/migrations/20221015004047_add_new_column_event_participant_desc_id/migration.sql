/*
  Warnings:

  - Added the required column `event_participant_description_id` to the `EventPrecondition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `eventprecondition` ADD COLUMN `event_participant_description_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `EventPrecondition` ADD CONSTRAINT `EventPrecondition_event_participant_description_id_fkey` FOREIGN KEY (`event_participant_description_id`) REFERENCES `EventPreconditionDescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
