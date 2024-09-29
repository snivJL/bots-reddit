ALTER TABLE "user" ADD COLUMN "firebaseId" varchar(32);--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN IF EXISTS "firebaseId";