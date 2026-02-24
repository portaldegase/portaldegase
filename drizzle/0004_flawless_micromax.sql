ALTER TABLE `posts` MODIFY COLUMN `status` enum('draft','published','archived','scheduled') NOT NULL DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `posts` ADD `scheduledAt` timestamp;--> statement-breakpoint
ALTER TABLE `posts` ADD `isScheduled` boolean DEFAULT false NOT NULL;