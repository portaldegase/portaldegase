CREATE TABLE `page_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`featuredImage` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`menuLabel` varchar(255),
	`showInMenu` boolean NOT NULL DEFAULT false,
	`editorId` int,
	`changeDescription` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featuredImage` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`editorId` int,
	`changeDescription` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_history_id` PRIMARY KEY(`id`)
);
