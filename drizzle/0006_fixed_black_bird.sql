ALTER TABLE "post" ALTER COLUMN "author_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "media_url" varchar(512);--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "media_type" varchar(10);