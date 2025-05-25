ALTER TABLE "chats" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "chunk_size";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "processing_started_at";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "processing_ended_at";