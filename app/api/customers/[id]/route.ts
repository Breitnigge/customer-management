export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const db = getDB();
  const customer = await db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .bind(params.id)
    .first();
  if (!customer)
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const db = getDB();
  const body = await request.json();
  const { name, phone = "", email = "", memo = "" } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }
  await db
    .prepare(
      `UPDATE customers SET name=?, phone=?, email=?, memo=?,
       updated_at=datetime('now','localtime') WHERE id=?`
    )
    .bind(name.trim(), phone, email, memo, params.id)
    .run();
  const customer = await db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .bind(params.id)
    .first();
  return NextResponse.json(customer);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = getDB();
  const result = await db
    .prepare("DELETE FROM customers WHERE id = ?")
    .bind(params.id)
    .run();
  if (result.meta.changes === 0)
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
