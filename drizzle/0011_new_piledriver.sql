ALTER TABLE "user" RENAME COLUMN "firebaseId" TO "firebase_uid";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "firebase_uid" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "firebase_uid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_firebase_uid_unique" UNIQUE("firebase_uid");