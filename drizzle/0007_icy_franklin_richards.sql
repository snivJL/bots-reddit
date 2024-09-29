ALTER TABLE "post" ADD COLUMN "content" text;

UPDATE "post" SET "content" = 'This is fake content.';

ALTER TABLE "post" ALTER COLUMN "content" SET NOT NULL;
