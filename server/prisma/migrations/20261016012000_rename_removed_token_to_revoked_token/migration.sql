ALTER TABLE "RemovedToken"
RENAME TO "RevokedToken";

ALTER TABLE "RevokedToken"
RENAME CONSTRAINT "RemovedToken_pkey"
TO "RevokedToken_pkey";
