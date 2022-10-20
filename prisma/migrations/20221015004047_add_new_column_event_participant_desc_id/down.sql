-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event_Organizer` DROP FOREIGN KEY `Event_Organizer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event_Organizer` DROP FOREIGN KEY `Event_Organizer_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event_Organizer_Precondition` DROP FOREIGN KEY `Event_Organizer_Precondition_event_organizer_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event_Organizer_Precondition` DROP FOREIGN KEY `Event_Organizer_Precondition_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `Participant` DROP FOREIGN KEY `Participant_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Participant` DROP FOREIGN KEY `Participant_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_event_organizer_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_eligibility_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventPreconditionDescription` DROP FOREIGN KEY `EventPreconditionDescription_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventParticipant` DROP FOREIGN KEY `EventParticipant_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventParticipant` DROP FOREIGN KEY `EventParticipant_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventPrecondition` DROP FOREIGN KEY `EventPrecondition_event_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventPrecondition` DROP FOREIGN KEY `EventPrecondition_event_participant_description_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventPrecondition` DROP FOREIGN KEY `EventPrecondition_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventComment` DROP FOREIGN KEY `EventComment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventComment` DROP FOREIGN KEY `EventComment_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationObject` DROP FOREIGN KEY `NotificationObject_entity_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_notification_object_id_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_notifier_id_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationChange` DROP FOREIGN KEY `NotificationChange_notification_object_id_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationChange` DROP FOREIGN KEY `NotificationChange_actor_id_fkey`;

-- DropForeignKey
ALTER TABLE `Feedback` DROP FOREIGN KEY `Feedback_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `SubscribeEO` DROP FOREIGN KEY `SubscribeEO_participant_id_fkey`;

-- DropForeignKey
ALTER TABLE `SubscribeEO` DROP FOREIGN KEY `SubscribeEO_event_organizer_id_fkey`;

-- DropTable
DROP TABLE `Session`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `Role`;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `Event_Organizer`;

-- DropTable
DROP TABLE `Event_Organizer_Precondition`;

-- DropTable
DROP TABLE `Participant`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `Eligibility`;

-- DropTable
DROP TABLE `Event`;

-- DropTable
DROP TABLE `EventPreconditionDescription`;

-- DropTable
DROP TABLE `EventParticipant`;

-- DropTable
DROP TABLE `EventPrecondition`;

-- DropTable
DROP TABLE `EventComment`;

-- DropTable
DROP TABLE `EntityType`;

-- DropTable
DROP TABLE `NotificationObject`;

-- DropTable
DROP TABLE `Notification`;

-- DropTable
DROP TABLE `NotificationChange`;

-- DropTable
DROP TABLE `Token`;

-- DropTable
DROP TABLE `Feedback`;

-- DropTable
DROP TABLE `SubscribeEO`;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eligibility` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Eligibility_name_key`(`name` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entitytype` (
    `id` INTEGER NOT NULL,
    `entity` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EntityType_entity_key`(`entity` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` INTEGER NOT NULL,
    `event_organizer_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date_time` DATETIME(3) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `eligibility_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `description` TEXT NOT NULL,
    `image_id` INTEGER NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Event_category_id_fkey`(`category_id` ASC),
    INDEX `Event_eligibility_id_fkey`(`eligibility_id` ASC),
    INDEX `Event_event_organizer_id_fkey`(`event_organizer_id` ASC),
    INDEX `Event_image_id_fkey`(`image_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_organizer` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `description` TEXT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image_id` INTEGER NULL,

    INDEX `Event_Organizer_image_id_fkey`(`image_id` ASC),
    UNIQUE INDEX `Event_Organizer_user_id_key`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_organizer_precondition` (
    `id` INTEGER NOT NULL,
    `event_organizer_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image_id` INTEGER NOT NULL,

    UNIQUE INDEX `Event_Organizer_Precondition_event_organizer_id_key`(`event_organizer_id` ASC),
    UNIQUE INDEX `Event_Organizer_Precondition_image_id_key`(`image_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventcomment` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `comment` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER NULL,
    `mentioned_user` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventComment_event_id_fkey`(`event_id` ASC),
    INDEX `EventComment_user_id_fkey`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventparticipant` (
    `id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventParticipant_event_id_fkey`(`event_id` ASC),
    INDEX `EventParticipant_participant_id_fkey`(`participant_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventprecondition` (
    `id` INTEGER NOT NULL,
    `event_participant_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image_id` INTEGER NOT NULL,

    INDEX `EventPrecondition_event_participant_id_fkey`(`event_participant_id` ASC),
    INDEX `EventPrecondition_image_id_fkey`(`image_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventpreconditiondescription` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `event_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventPreconditionDescription_event_id_fkey`(`event_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `review` TEXT NOT NULL,
    `star` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Feedback_user_id_fkey`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `id` INTEGER NOT NULL,
    `public_id` VARCHAR(191) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `version` INTEGER NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `etag` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `secure_url` VARCHAR(191) NOT NULL,
    `signature` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL,
    `notification_object_id` INTEGER NOT NULL,
    `notifier_id` INTEGER NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notification_notification_object_id_fkey`(`notification_object_id` ASC),
    INDEX `Notification_notifier_id_fkey`(`notifier_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificationchange` (
    `id` INTEGER NOT NULL,
    `notification_object_id` INTEGER NOT NULL,
    `actor_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NotificationChange_actor_id_fkey`(`actor_id` ASC),
    INDEX `NotificationChange_notification_object_id_fkey`(`notification_object_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificationobject` (
    `id` INTEGER NOT NULL,
    `entity_type_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NotificationObject_entity_type_id_fkey`(`entity_type_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participant` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `birth_date` DATETIME(3) NULL,
    `status` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image_id` INTEGER NULL,

    INDEX `Participant_image_id_fkey`(`image_id` ASC),
    UNIQUE INDEX `Participant_phone_number_key`(`phone_number` ASC),
    UNIQUE INDEX `Participant_user_id_key`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` INTEGER NOT NULL,
    `access_token` TEXT NOT NULL,
    `refresh_token` TEXT NOT NULL,
    `refresh_token_expired_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Session_user_id_fkey`(`user_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribeeo` (
    `id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `event_organizer_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SubscribeEO_event_organizer_id_fkey`(`event_organizer_id` ASC),
    INDEX `SubscribeEO_participant_id_fkey`(`participant_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `id` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` TEXT NOT NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email` ASC),
    INDEX `User_role_id_fkey`(`role_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_eligibility_id_fkey` FOREIGN KEY (`eligibility_id`) REFERENCES `eligibility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_event_organizer_id_fkey` FOREIGN KEY (`event_organizer_id`) REFERENCES `event_organizer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_organizer` ADD CONSTRAINT `Event_Organizer_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_organizer` ADD CONSTRAINT `Event_Organizer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_organizer_precondition` ADD CONSTRAINT `Event_Organizer_Precondition_event_organizer_id_fkey` FOREIGN KEY (`event_organizer_id`) REFERENCES `event_organizer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_organizer_precondition` ADD CONSTRAINT `Event_Organizer_Precondition_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventcomment` ADD CONSTRAINT `EventComment_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventcomment` ADD CONSTRAINT `EventComment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventparticipant` ADD CONSTRAINT `EventParticipant_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventparticipant` ADD CONSTRAINT `EventParticipant_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventprecondition` ADD CONSTRAINT `EventPrecondition_event_participant_id_fkey` FOREIGN KEY (`event_participant_id`) REFERENCES `eventparticipant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventprecondition` ADD CONSTRAINT `EventPrecondition_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventpreconditiondescription` ADD CONSTRAINT `EventPreconditionDescription_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `Feedback_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `Notification_notification_object_id_fkey` FOREIGN KEY (`notification_object_id`) REFERENCES `notificationobject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `Notification_notifier_id_fkey` FOREIGN KEY (`notifier_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationchange` ADD CONSTRAINT `NotificationChange_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationchange` ADD CONSTRAINT `NotificationChange_notification_object_id_fkey` FOREIGN KEY (`notification_object_id`) REFERENCES `notificationobject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationobject` ADD CONSTRAINT `NotificationObject_entity_type_id_fkey` FOREIGN KEY (`entity_type_id`) REFERENCES `entitytype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participant` ADD CONSTRAINT `Participant_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participant` ADD CONSTRAINT `Participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `Session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribeeo` ADD CONSTRAINT `SubscribeEO_event_organizer_id_fkey` FOREIGN KEY (`event_organizer_id`) REFERENCES `event_organizer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribeeo` ADD CONSTRAINT `SubscribeEO_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

