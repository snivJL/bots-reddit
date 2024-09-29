ALTER TABLE "comment" ADD COLUMN "parent_comment_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_comment_id_comment_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
