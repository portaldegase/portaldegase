DROP TABLE `analytics`;--> statement-breakpoint
DROP TABLE `banners`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
DROP TABLE `color_themes`;--> statement-breakpoint
DROP TABLE `comments`;--> statement-breakpoint
DROP TABLE `media_library`;--> statement-breakpoint
DROP TABLE `page_history`;--> statement-breakpoint
DROP TABLE `pages`;--> statement-breakpoint
DROP TABLE `post_history`;--> statement-breakpoint
DROP TABLE `post_tags`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
DROP TABLE `site_config`;--> statement-breakpoint
DROP TABLE `social_media_shares`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
DROP TABLE `transparency_items`;--> statement-breakpoint
DROP TABLE `units`;--> statement-breakpoint
DROP TABLE `videos`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `categoryId`;