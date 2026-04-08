import { NextRequest, NextResponse } from "next/server";
import { getSpouses } from "@/lib/actions/family-member";

export const runtime = "nodejs";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const spouses = await getSpouses(params.id);
    return NextResponse.json(spouses);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || "Failed to fetch spouses" }, { status: 500 });
  }
}
