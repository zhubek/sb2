CREATE TABLE "AuthCredential" (
  "userId" INTEGER PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE,
  "passwordHash" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "version" INTEGER NOT NULL DEFAULT 1 CHECK ("version" > 0),
  "contentAdmin" BOOLEAN NOT NULL DEFAULT false
);
