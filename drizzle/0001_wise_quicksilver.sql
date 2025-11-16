CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementType` varchar(50) NOT NULL,
	`achievementName` varchar(100) NOT NULL,
	`achievementDescription` text,
	`iconUrl` text,
	`xpReward` int NOT NULL DEFAULT 0,
	`coinsReward` int NOT NULL DEFAULT 0,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`activityType` varchar(50) NOT NULL,
	`location` varchar(200),
	`locationLat` decimal(10,8),
	`locationLng` decimal(11,8),
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`maxParticipants` int,
	`currentParticipants` int NOT NULL DEFAULT 0,
	`price` int NOT NULL DEFAULT 0,
	`imageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activityParticipants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activityId` int NOT NULL,
	`userId` int NOT NULL,
	`status` enum('registered','confirmed','cancelled') NOT NULL DEFAULT 'registered',
	`registeredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityParticipants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`context` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lastClaimDate` timestamp NOT NULL,
	`streakCount` int NOT NULL DEFAULT 1,
	`coinsEarned` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyRewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`receiverId` int NOT NULL,
	`giftType` varchar(50) NOT NULL,
	`giftName` varchar(100) NOT NULL,
	`giftData` text,
	`price` int NOT NULL,
	`status` enum('pending','sent','delivered','failed') NOT NULL DEFAULT 'pending',
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`deliveredAt` timestamp,
	CONSTRAINT `gifts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user1Id` int NOT NULL,
	`user2Id` int NOT NULL,
	`matchedAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text,
	`data` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`price` int,
	`affiliateLink` text NOT NULL,
	`affiliatePartner` varchar(50),
	`imageUrl` text,
	`rating` decimal(3,2),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`swiperId` int NOT NULL,
	`swipedId` int NOT NULL,
	`direction` enum('left','right','super') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `swipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vipCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`maxUses` int NOT NULL DEFAULT 1,
	`usedCount` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vipCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `vipCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `birthDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `age` int;--> statement-breakpoint
ALTER TABLE `users` ADD `gender` enum('male','female','other');--> statement-breakpoint
ALTER TABLE `users` ADD `zodiacSign` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `profilePhotoUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `interests` text;--> statement-breakpoint
ALTER TABLE `users` ADD `hairColor` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `eyeColor` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `height` int;--> statement-breakpoint
ALTER TABLE `users` ADD `weight` int;--> statement-breakpoint
ALTER TABLE `users` ADD `origin` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `bodyType` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `hasChildren` boolean;--> statement-breakpoint
ALTER TABLE `users` ADD `wantsChildren` boolean;--> statement-breakpoint
ALTER TABLE `users` ADD `lookingFor` text;--> statement-breakpoint
ALTER TABLE `users` ADD `locationLat` decimal(10,8);--> statement-breakpoint
ALTER TABLE `users` ADD `locationLng` decimal(11,8);--> statement-breakpoint
ALTER TABLE `users` ADD `locationUpdatedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `coins` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `level` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `xp` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `streakCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastLoginDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `isPremium` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `premiumExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `isVip` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `vipCodeUsed` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `verificationToken` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `resetToken` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `resetTokenExpires` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastSeen` timestamp;