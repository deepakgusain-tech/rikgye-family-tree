import { cmsSchema, userSchema } from "@/lib/validators";
import z from "zod";

export type User = z.infer<typeof userSchema>
export type CMS = z.infer<typeof cmsSchema>








