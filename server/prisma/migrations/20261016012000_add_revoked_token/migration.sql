-- Revoked JWTs (logout). IF NOT EXISTS keeps this a no-op on databases where
-- the table was already created outside migrations.

-- CreateTable
CREATE TABLE IF NOT EXISTS "RevokedToken" (
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevokedToken_pkey" PRIMARY KEY ("jti")
);
