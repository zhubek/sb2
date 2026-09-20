-- CreateTable
CREATE TABLE "ContentDocument" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "kind" TEXT,
    "preview" TEXT NOT NULL,
    "defaultValue" JSONB NOT NULL,
    "draft" JSONB,
    "published" JSONB,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "publishedRevision" INTEGER NOT NULL DEFAULT 0,
    "searchText" TEXT NOT NULL,
    "dirty" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "ContentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRevision" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" JSONB NOT NULL,

    CONSTRAINT "ContentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAudit" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "requestId" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAdministrator" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContentAdministrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataImport" (
    "id" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordCount" INTEGER NOT NULL,

    CONSTRAINT "DataImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTestAttempt" (
    "id" TEXT NOT NULL,
    "ownerKey" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "values" JSONB NOT NULL,
    "snapshot" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "requestKey" TEXT,

    CONSTRAINT "ContentTestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentDocument_group_id_idx" ON "ContentDocument"("group", "id");

-- CreateIndex
CREATE INDEX "ContentDocument_dirty_updatedAt_idx" ON "ContentDocument"("dirty", "updatedAt");

-- CreateIndex
CREATE INDEX "ContentRevision_documentId_at_idx" ON "ContentRevision"("documentId", "at" DESC);

-- CreateIndex
CREATE INDEX "ContentAudit_at_idx" ON "ContentAudit"("at");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAudit_documentId_revision_key" ON "ContentAudit"("documentId", "revision");

-- CreateIndex
CREATE INDEX "ContentTestAttempt_ownerKey_at_idx" ON "ContentTestAttempt"("ownerKey", "at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ContentTestAttempt_ownerKey_requestKey_key" ON "ContentTestAttempt"("ownerKey", "requestKey");

-- AddForeignKey
ALTER TABLE "ContentRevision" ADD CONSTRAINT "ContentRevision_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ContentDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Keep the fixed-test and revision invariants below every transport boundary.
ALTER TABLE "ContentDocument" ADD CONSTRAINT "ContentDocument_fixed_tests" CHECK ("kind" IS DISTINCT FROM 'test' OR "id" IN ('test.debruce','test.mbti','test.holland'));
ALTER TABLE "ContentDocument" ADD CONSTRAINT "ContentDocument_revision_valid" CHECK ("revision" >= 0 AND "publishedRevision" >= 0 AND "publishedRevision" <= "revision");
ALTER TABLE "ContentRevision" ADD CONSTRAINT "ContentRevision_action_valid" CHECK ("action" IN ('save','publish','restore'));
