import { NextResponse } from "next/server";
import { getTreeData } from "@/lib/actions/family-member";

export const runtime = "nodejs";

export async function GET() {
  try {
    const treeData = await getTreeData();
    return NextResponse.json(treeData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch family tree data" }, { status: 500 });
  }
}
