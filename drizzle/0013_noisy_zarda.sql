CREATE TABLE `service_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`clickCount` int NOT NULL DEFAULT 0,
	`lastClickedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_click_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`userAgent` varchar(500),
	`referer` varchar(1024),
	`ipAddress` varchar(45),
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_click_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `service_analytics` ADD CONSTRAINT `service_analytics_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_click_log` ADD CONSTRAINT `service_click_log_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;