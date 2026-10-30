import { prisma } from "../db/prisma";

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // daily
const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // time staff get to record an outcome

// Staff usually record outcomes by hand; anything left SCHEDULED past the grace
// period is assumed to have happened. PENDING was never confirmed, so it stays.
export const completeStaleAppointments = async () => {
  try {
    const { count } = await prisma.appointment.updateMany({
      where: {
        status: "SCHEDULED",
        startAt: { lt: new Date(Date.now() - GRACE_PERIOD_MS) },
      },
      data: { status: "COMPLETED" },
    });

    if (count > 0) {
      console.log(`Marked ${count} past appointment(s) as completed.`);
    }
  } catch (error) {
    console.error("Error completing past appointments:", error);
  }
};

export const scheduleAppointmentOutcomeCleanup = () => {
  void completeStaleAppointments();
  // unref: don't keep the process alive just for this timer
  setInterval(completeStaleAppointments, CLEANUP_INTERVAL_MS).unref();
};
