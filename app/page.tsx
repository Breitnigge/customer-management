"use client";
export const runtime = "edge";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  memo: string;
  created_at: string;
  updated_at: string;
};

export default function HomePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async (q: string) => {
    setLoading(true);
    const res = await fetch(`/api/customers?q=${encodeURIComponent(q)}`);
    const data = await res.json() as Customer[];
    setCustomers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(query), 200);
    return () => clearTimeout(timer);
  }, [query, fetchCustomers]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">顧客一覧</h1>
        <Link
          href="/customers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ＋ 新規登録
        </Link>
      </div>

      <input
        type="text"
        placeholder="名前・電話番号・メールで検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading ? (
        <p className="text-gray-400 text-center py-10">読み込み中...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          {query ? "該当する顧客が見つかりません" : "顧客が登録されていません"}
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3">名前</th>
                <th className="text-left px-4 py-3">電話番号</th>
                <th className="text-left px-4 py-3">メールアドレス</th>
                <th className="text-left px-4 py-3">更新日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/customers/${c.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{c.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
