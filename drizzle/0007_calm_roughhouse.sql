CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int,
	`pageUrl` varchar(1024),
	`viewCount` int NOT NULL DEFAULT 0,
	`uniqueVisitors` int NOT NULL DEFAULT 0,
	`avgTimeOnPage` int NOT NULL DEFAULT 0,
	`bounceRate` int NOT NULL DEFAULT 0,
	`date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_media_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`platform` varchar(50) NOT NULL,
	`externalId` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`sharedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_media_shares_id` PRIMARY KEY(`id`)
);
