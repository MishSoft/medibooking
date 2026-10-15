import { z } from "zod"


export const doctorSlotsParamsSchema = z.object({
  id: z.string().uuid("Wrong Doctor ID type")
})


export const doctorSlotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Wrong Date type"),
});



export type DoctorSlotsParamsSchema = z.infer<typeof doctorSlotsParamsSchema>;
export type DoctorSlotsQuerySchema = z.infer<typeof doctorSlotsQuerySchema>
