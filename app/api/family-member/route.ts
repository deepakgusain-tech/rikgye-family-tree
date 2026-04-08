import { NextResponse } from "next/server";
import { createFamilyMember } from "@/lib/actions/family-member";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const member = await createFamilyMember(body);
    return NextResponse.json(member);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || "Failed to create family member" }, { status: 500 });
  }
}
