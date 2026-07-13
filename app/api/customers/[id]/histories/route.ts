export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const db = getDB();
  const { results } = await db
    .prepare(
      "SELECT * FROM purchase_histories WHERE customer_id = ? ORDER BY purchase_date DESC"
    )
    .bind(params.id)
    .all();
  return NextResponse.json(results);
}

export async function POST(request: NextRequest, { params }: Params) {
  const db = getDB();
  const body = await request.json();
  const { purchase_date, product_name, amount = 0, memo = "" } = body;
  if (!product_name?.trim()) {
    return NextResponse.json({ error: "商品名は必須です" }, { status: 400 });
  }
  if (!purchase_date) {
    return NextResponse.json({ error: "購入日は必須です" }, { status: 400 });
  }
  const result = await db
    .prepare(
      `INSERT INTO purchase_histories (customer_id, purchase_date, product_name, amount, memo)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(params.id, purchase_date, product_name.trim(), amount, memo)
    .run();
  const history = await db
    .prepare("SELECT * FROM purchase_histories WHERE id = ?")
    .bind(result.meta.last_row_id)
    .first();
  return NextResponse.json(history, { status: 201 });
}
