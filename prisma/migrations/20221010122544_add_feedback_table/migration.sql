-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `review` TEXT NOT NULL,
    `star` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
