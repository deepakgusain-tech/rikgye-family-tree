import { cmsSchema, familyMemberSchema, userSchema } from "@/lib/validators";
import z from "zod";

export type User = z.infer<typeof userSchema>
export type CMS = z.infer<typeof cmsSchema>
export type FamilyMember = z.infer<typeof familyMemberSchema>;

export interface Family {
id: string;
name: string;
members: FamilyMember[];
}
