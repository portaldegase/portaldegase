CREATE TABLE `social_media_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` varchar(50) NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text,
	`expiresAt` int,
	`pageId` varchar(255),
	`accountId` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_media_credentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_media_credentials_platform_unique` UNIQUE(`platform`)
);
--> statement-breakpoint
CREATE TABLE `social_media_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`platform` text NOT NULL,
	`sharedUrl` text,
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	`status` text NOT NULL DEFAULT ('pending'),
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_media_shares_id` PRIMARY KEY(`id`)
);
