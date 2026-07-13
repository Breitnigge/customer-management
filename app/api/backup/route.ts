export const runtime = "edge";
import { NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

export async function GET() {
  const db = getDB();
  const { results: customers } = await db
    .prepare("SELECT * FROM customers ORDER BY id")
    .all();
  const { results: histories } = await db
    .prepare("SELECT * FROM purchase_histories ORDER BY id")
    .all();
  const data = {
    customers,
    histories,
    exported_at: new Date().toISOString(),
  };
  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="backup-${today}.json"`,
    },
  });
}
