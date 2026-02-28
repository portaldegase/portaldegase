CREATE TABLE `images_bank` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(1024) NOT NULL,
	`fileKey` varchar(1024) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`width` int,
	`height` int,
	`alt` varchar(255),
	`title` varchar(255),
	`sourceType` enum('post','service','document','banner','manual') NOT NULL,
	`sourceId` int,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `images_bank_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_block_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blockId` int NOT NULL,
	`itemType` enum('service','documentCategory','image') NOT NULL,
	`itemId` int,
	`sortOrder` int NOT NULL DEFAULT 0,
	`customData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_block_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` int NOT NULL,
	`blockType` enum('services','documentCategories','images','text','html') NOT NULL,
	`title` varchar(255),
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`config` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `images_bank` ADD CONSTRAINT `images_bank_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_block_items` ADD CONSTRAINT `page_block_items_blockId_page_blocks_id_fk` FOREIGN KEY (`blockId`) REFERENCES `page_blocks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_blocks` ADD CONSTRAINT `page_blocks_pageId_pages_id_fk` FOREIGN KEY (`pageId`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;