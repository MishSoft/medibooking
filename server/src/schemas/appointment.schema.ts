import {z} from  "zod"


export const createAppointmentSchema = z.object({
  doctorId: z.string().uuid("Wrong Doctor ID type"),
  startAt: z.string().datetime({ offset: true, message: "Wrong date type" }),
});


export const paramsSchema = z.object({
  id: z.string().uuid("Wrong Appointment ID type"),
});



export type ParamsSchema = z.infer<typeof paramsSchema>
export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
