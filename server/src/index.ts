import "dotenv/config";
import app from "./app";
import { scheduleRevokedTokenCleanup } from "./services/revokedToken.cleanup";
import { scheduleAppointmentOutcomeCleanup } from "./services/appointmentOutcome.cleanup";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  scheduleRevokedTokenCleanup();
  scheduleAppointmentOutcomeCleanup();
});
