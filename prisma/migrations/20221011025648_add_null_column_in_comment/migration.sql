-- AlterTable
ALTER TABLE `eventcomment` MODIFY `parent_id` INTEGER NULL,
    MODIFY `mentioned_user` VARCHAR(191) NULL;
