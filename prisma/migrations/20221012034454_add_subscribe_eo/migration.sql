-- CreateTable
CREATE TABLE `SubscribeEO` (
    `id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `event_organizer_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubscribeEO` ADD CONSTRAINT `SubscribeEO_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscribeEO` ADD CONSTRAINT `SubscribeEO_event_organizer_id_fkey` FOREIGN KEY (`event_organizer_id`) REFERENCES `Event_Organizer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
