import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/user-action";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || "Failed to fetch current user" }, { status: 500 });
  }
}
