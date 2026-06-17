import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const DOC = () => getAdminDb().collection("config").doc("site");

export async function GET() {
  try {
    const snap = await DOC().get();
    return NextResponse.json(snap.exists ? snap.data() : {});
  } catch (err) {
    console.error("[GET /api/config]", err);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await DOC().set(body, { merge: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/config]", err);
    return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
  }
}
