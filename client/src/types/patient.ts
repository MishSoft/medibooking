// Patient as seen by a doctor; phone/email depend on the endpoint
export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
};
