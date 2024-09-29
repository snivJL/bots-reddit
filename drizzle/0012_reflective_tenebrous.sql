DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "upvotes" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "upvotes" SET DEFAULT 0;