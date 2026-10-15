import { prisma } from "../db/prisma";

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // daily

// Expired tokens are rejected by jwt.verify anyway, so their rows are dead weight
export const deleteExpiredRevokedTokens = async () => {
  try {
    const { count } = await prisma.revokedToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    if (count > 0) {
      console.log(`Removed ${count} expired revoked token(s).`);
    }
  } catch (error) {
    console.error("Error cleaning up revoked tokens:", error);
  }
};

export const scheduleRevokedTokenCleanup = () => {
  void deleteExpiredRevokedTokens();
  // unref: don't keep the process alive just for this timer
  setInterval(deleteExpiredRevokedTokens, CLEANUP_INTERVAL_MS).unref();
};
