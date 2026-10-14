import {Request, Response} from "express"
import { prisma } from "../db/prisma";



export const getClinics = async (req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinic.findMany({
      select: {
        id: true,
        name: true,
        address: true
      }
    })

    return res.status(200).json({
      success: true,
      data: clinics
    })
  } catch(error)
  {
    console.error("Error fetching clinics:", error)
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "სერვერის შეცდომა."
    })
 }}
