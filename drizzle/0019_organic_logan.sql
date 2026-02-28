CREATE TABLE `menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`linkType` enum('internal','external') NOT NULL,
	`internalPageId` int,
	`externalUrl` varchar(1024),
	`parentId` int,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`openInNewTab` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_internalPageId_pages_id_fk` FOREIGN KEY (`internalPageId`) REFERENCES `pages`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_parentId_menu_items_id_fk` FOREIGN KEY (`parentId`) REFERENCES `menu_items`(`id`) ON DELETE cascade ON UPDATE no action;