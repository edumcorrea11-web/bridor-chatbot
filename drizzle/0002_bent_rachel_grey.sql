ALTER TABLE `conversations` ADD `isExistingCustomer` boolean;--> statement-breakpoint
ALTER TABLE `conversations` ADD `leadName` varchar(255);--> statement-breakpoint
ALTER TABLE `conversations` ADD `leadCity` varchar(100);--> statement-breakpoint
ALTER TABLE `conversations` ADD `leadState` varchar(2);--> statement-breakpoint
ALTER TABLE `conversations` ADD `establishmentType` enum('supermercado','cafeteria','padaria_confeitaria','buffet','catering','distribuidor','representante');