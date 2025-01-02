DO $$ BEGIN
    CREATE TYPE "public"."status" AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."type" AS ENUM('link', 'pdf', 'txt', 'csv', 'json');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536),
	"chunk_index" integer NOT NULL,
	"metadata" jsonb,
	"model" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "type" SET DATA TYPE type USING type::type;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "status" "status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "mime_type" varchar(100);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "chunk_size" integer;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "processing_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "processing_ended_at" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "type_idx" ON "documents" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_id_idx" ON "documents" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "file_url";