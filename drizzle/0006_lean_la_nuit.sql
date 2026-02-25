CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`authorEmail` varchar(320) NOT NULL,
	`content` text NOT NULL,
	`status` enum('pending','approved','rejected','spam') NOT NULL DEFAULT 'pending',
	`moderatedBy` int,
	`moderationReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media_library` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileType` enum('image','video') NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSize` int,
	`width` int,
	`height` int,
	`duration` int,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_library_id` PRIMARY KEY(`id`)
);
