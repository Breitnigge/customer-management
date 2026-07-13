export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import fs from "fs";
import { DB_PATH } from "@/lib/db";

export async function GET() {
  if (!fs.existsSync(DB_PATH)) {
    return NextResponse.json(
      { error: "DBファイルが見つかりません" },
      { status: 500 }
    );
  }
  const fileBuffer = fs.readFileSync(DB_PATH);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="customers_backup.db"`,
    },
  });
}
