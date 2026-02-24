ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','contributor') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `categoryId` int;