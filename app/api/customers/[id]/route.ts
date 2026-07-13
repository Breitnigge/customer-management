export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const customer = db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .get(params.id);
  if (!customer)
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const { name, phone = "", email = "", memo = "" } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }
  db.prepare(
    `UPDATE customers SET name=?, phone=?, email=?, memo=?,
     updated_at=datetime('now','localtime') WHERE id=?`
  ).run(name.trim(), phone, email, memo, params.id);
  const customer = db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .get(params.id);
  return NextResponse.json(customer);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const info = db
    .prepare("DELETE FROM customers WHERE id = ?")
    .run(params.id);
  if (info.changes === 0)
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
