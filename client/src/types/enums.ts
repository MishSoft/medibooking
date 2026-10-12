// Mirrors Role and Gender enums in server/prisma/schema.prisma

export const Role = {
  PATIENT: "PATIENT",
  DOCTOR: "DOCTOR",
  CLINIC_ADMIN: "CLINIC_ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  NONBINARY: "NONBINARY",
  UNDISCLOSED: "UNDISCLOSED",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
