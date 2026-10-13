// Mock-backed for now — swap bodies for apiRequest calls once the server exposes prescriptions
import { mockDelay } from "../mocks/appointments";
import { mockPrescriptions } from "../mocks/prescriptions";
import type { Prescription } from "../types/prescription";

export const prescriptionsApi = {
  list: async (): Promise<Prescription[]> => {
    await mockDelay();
    return [...mockPrescriptions];
  },
};
