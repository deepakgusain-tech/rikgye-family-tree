import { NextRequest, NextResponse } from "next/server";
import { deleteFamilyMember, getFamilyMemberByID, updateFamilyMember } from "@/lib/actions/family-member";

export const runtime = "nodejs";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const member = await getFamilyMemberByID(params.id);
    return NextResponse.json(member);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || "Failed to fetch member" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const body = await req.json();
    const member = await updateFamilyMember({ ...body, id: params.id });
    return NextResponse.json(member);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const url = new URL(req.url);
    const deleteChildren = url.searchParams.get("deleteChildren") === "true";
    await deleteFamilyMember(params.id, deleteChildren);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || "Failed to delete member" }, { status: 500 });
  }
}
