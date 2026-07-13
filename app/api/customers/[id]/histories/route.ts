export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const histories = db
    .prepare(
      "SELECT * FROM purchase_histories WHERE customer_id = ? ORDER BY purchase_date DESC"
    )
    .all(params.id);
  return NextResponse.json(histories);
}

export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const { purchase_date, product_name, amount = 0, memo = "" } = body;
  if (!product_name?.trim()) {
    return NextResponse.json({ error: "商品名は必須です" }, { status: 400 });
  }
  if (!purchase_date) {
    return NextResponse.json({ error: "購入日は必須です" }, { status: 400 });
  }
  const result = db
    .prepare(
      `INSERT INTO purchase_histories (customer_id, purchase_date, product_name, amount, memo)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(params.id, purchase_date, product_name.trim(), amount, memo);
  const history = db
    .prepare("SELECT * FROM purchase_histories WHERE id = ?")
    .get(result.lastInsertRowid);
  return NextResponse.json(history, { status: 201 });
}
