ALTER TYPE "QuestionType" ADD VALUE 'TEXT';
ALTER TABLE "InstitutionProgram" ADD COLUMN "contentKey" TEXT, ADD COLUMN "contentRevision" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "threshold" INTEGER;
CREATE UNIQUE INDEX "InstitutionProgram_contentKey_key" ON "InstitutionProgram"("contentKey");
