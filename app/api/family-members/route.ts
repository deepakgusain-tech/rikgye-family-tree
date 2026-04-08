import { NextResponse } from "next/server";
import { getFamilyMembers } from "@/lib/actions/family-member";

export const runtime = "nodejs";

export async function GET() {
  try {
    const members = await getFamilyMembers();
    return NextResponse.json(members);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || "Failed to fetch family members" }, { status: 500 });
  }
}
