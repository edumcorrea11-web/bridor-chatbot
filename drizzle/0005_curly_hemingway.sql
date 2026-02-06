ALTER TABLE `conversations` ADD `leadLocation` varchar(150);--> statement-breakpoint
ALTER TABLE `conversations` DROP COLUMN `leadCity`;--> statement-breakpoint
ALTER TABLE `conversations` DROP COLUMN `leadState`;