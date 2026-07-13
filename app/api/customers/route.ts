export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

export async function GET(request: NextRequest) {
  const db = getDB();
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const { results } = q
    ? await db
        .prepare(
          `SELECT * FROM customers
           WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?
           ORDER BY updated_at DESC`
        )
        .bind(`%${q}%`, `%${q}%`, `%${q}%`)
        .all()
    : await db
        .prepare("SELECT * FROM customers ORDER BY updated_at DESC")
        .all();
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const body = await request.json();
  const { name, phone = "", email = "", memo = "" } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }
  const result = await db
    .prepare(
      "INSERT INTO customers (name, phone, email, memo) VALUES (?, ?, ?, ?)"
    )
    .bind(name.trim(), phone, email, memo)
    .run();
  const customer = await db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .bind(result.meta.last_row_id)
    .first();
  return NextResponse.json(customer, { status: 201 });
}
