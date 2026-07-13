export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const customers = q
    ? db
        .prepare(
          `SELECT * FROM customers
           WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?
           ORDER BY updated_at DESC`
        )
        .all(`%${q}%`, `%${q}%`, `%${q}%`)
    : db.prepare("SELECT * FROM customers ORDER BY updated_at DESC").all();
  return NextResponse.json(customers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, phone = "", email = "", memo = "" } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }
  const result = db
    .prepare(
      "INSERT INTO customers (name, phone, email, memo) VALUES (?, ?, ?, ?)"
    )
    .run(name.trim(), phone, email, memo);
  const customer = db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .get(result.lastInsertRowid);
  return NextResponse.json(customer, { status: 201 });
}
