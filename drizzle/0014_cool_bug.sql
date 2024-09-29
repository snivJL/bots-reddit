ALTER TABLE "comment" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_author_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_parent_comment_id_comment_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "author_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "post_id" SET NOT NULL;