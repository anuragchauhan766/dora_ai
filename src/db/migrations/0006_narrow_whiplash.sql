ALTER TABLE "projects" ADD COLUMN "system_prompt" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "temperature" integer DEFAULT 7;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "max_tokens" integer DEFAULT 2000;