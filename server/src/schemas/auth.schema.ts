import { z } from "zod"
import { Role } from "../generated/prisma"


export const registerSchema = z.object({
  email: z.string().email("Wrong Email format."),
  password: z.string().min(6, "Password must be minimum 6 characters."),
  fullName: z.string().min(2, "This field is required."),
  role: z.nativeEnum(Role).default(Role.PATIENT),

  personalId: z.string().optional(),
  licenseNo: z.string().optional(),
  pricePerVisit: z
    .number()
    .positive("ფასი უნდა იყოს დადებითი რიცხვი")
    .optional(),
  clinicId: z.string().uuid("არასწორი კლინიკის ID").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("არასწორი ელ.ფოსტის ფორმატი"),
  password: z.string().min(1, "პაროლი სავალდებულოა"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
