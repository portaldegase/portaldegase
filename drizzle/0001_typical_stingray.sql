CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`viewCount` int NOT NULL DEFAULT 0,
	`uniqueVisitors` int NOT NULL DEFAULT 0,
	`lastViewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	`ipHash` varchar(64),
	`userAgent` text,
	`referrer` text,
	CONSTRAINT `pageViews_id` PRIMARY KEY(`id`)
);
