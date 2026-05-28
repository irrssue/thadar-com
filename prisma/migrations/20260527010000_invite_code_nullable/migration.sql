-- Make invite code optional; default disabled. Class is created first; teacher
-- generates code on demand from the class detail page.

ALTER TABLE "Class" ALTER COLUMN "inviteCode" DROP NOT NULL;
ALTER TABLE "Class" ALTER COLUMN "inviteCodeEnabled" SET DEFAULT false;
