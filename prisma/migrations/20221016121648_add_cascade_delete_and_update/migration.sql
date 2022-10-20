-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_eligibility_id_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_event_organizer_id_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `event_organizer` DROP FOREIGN KEY `Event_Organizer_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `event_organizer` DROP FOREIGN KEY `Event_Organizer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `event_organizer_precondition` DROP FOREIGN KEY `Event_Organizer_Precondition_event_organizer_id_fkey`;

-- DropForeignKey
ALTER TABLE `event_organizer_precondition` DROP FOREIGN KEY `Event_Organizer_Precondition_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventcomment` DROP FOREIGN KEY `EventComment_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventcomment` DROP FOREIGN KEY `EventComment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventparticipant` DROP FOREIGN KEY `EventParticipant_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventparticipant` DROP FOREIGN KEY `EventParticipant_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventprecondition` DROP FOREIGN KEY `EventPrecondition_event_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventprecondition` DROP FOREIGN KEY `EventPrecondition_event_precondition_description_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventprecondition` DROP FOREIGN KEY `EventPrecondition_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventpreconditiondescription` DROP FOREIGN KEY `EventPreconditionDescription_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `participant` DROP FOREIGN KEY `Participant_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `participant` DROP FOREIGN KEY `Participant_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `subscribeeo` DROP FOREIGN KEY `SubscribeEO_event_organizer_id_fkey`;

-- DropForeignKey
ALTER TABLE `subscribeeo` DROP FOREIGN KEY `SubscribeEO_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_id_fkey`;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Organizer` ADD CONSTRAINT `Event_Organizer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Organizer` ADD CONSTRAINT `Event_Organizer_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Organizer_Precondition` ADD CONSTRAINT `Event_Organizer_Precondition_event_organizer_id_fkey` FOREIGN KEY (`event_organizer_id`) REFERENCES `Event_Organizer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Organizer_Precondition` ADD CONSTRAINT `Event_Organizer_Precondition_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_event_organizer_id_fkey` FOREIGN KEY (`event_organizer_id`) REFERENCES `Event_Organizer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_eligibility_id_fkey` FOREIGN KEY (`eligibility_id`) REFERENCES `Eligibility`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPreconditionDescription` ADD CONSTRAINT `EventPreconditionDescription_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventParticipant` ADD CONSTRAINT `EventParticipant_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `Participant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventParticipant` ADD CONSTRAINT `EventParticipant_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPrecondition` ADD CONSTRAINT `EventPrecondition_event_participant_id_fkey` FOREIGN KEY (`event_participant_id`) REFERENCES `EventParticipant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPrecondition` ADD CONSTRAINT `EventPrecondition_event_precondition_description_id_fkey` FOREIGN KEY (`event_precondition_description_id`) REFERENCES `EventPreconditionDescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPrecondition` ADD CONSTRAINT `EventPrecondition_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventComment` ADD CONSTRAINT `EventComment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventComment` ADD CONSTRAINT `EventComment_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscribeEO` ADD CONSTRAINT `SubscribeEO_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `Participant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscribeEO` ADD CONSTRAINT `SubscribeEO_event_organizer_id_fkey` FOREIGN KEY (`event_organizer_id`) REFERENCES `Event_Organizer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
