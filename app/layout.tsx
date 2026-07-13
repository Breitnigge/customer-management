import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "顧客管理システム",
  description: "顧客の名前・連絡先・購入履歴を管理するWebアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-blue-700 text-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-wide">
              顧客管理システム
            </a>
            <a
              href="/api/backup"
              className="text-sm bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-50"
            >
              DBバックアップ
            </a>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
