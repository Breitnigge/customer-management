"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

type History = {
  id: number;
  purchase_date: string;
  product_name: string;
  amount: number;
  memo: string;
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [histories, setHistories] = useState<History[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", memo: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [histForm, setHistForm] = useState({
    purchase_date: "",
    product_name: "",
    amount: "",
    memo: "",
  });
  const [histError, setHistError] = useState("");
  const [addingHist, setAddingHist] = useState(false);
  const [showHistForm, setShowHistForm] = useState(false);

  const fetchCustomer = useCallback(async () => {
    const res = await fetch(`/api/customers/${id}`);
    if (!res.ok) { router.push("/"); return; }
    const data = await res.json() as Customer;
    setCustomer(data);
    setForm({ name: data.name, phone: data.phone, email: data.email, memo: data.memo });
  }, [id, router]);

  const fetchHistories = useCallback(async () => {
    const res = await fetch(`/api/customers/${id}/histories`);
    setHistories(await res.json() as History[]);
  }, [id]);

  useEffect(() => {
    fetchCustomer();
    fetchHistories();
  }, [fetchCustomer, fetchHistories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("名前は必須です"); return; }
    setSaving(true);
    const res = await fetch(`/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetchCustomer();
      setEditing(false);
      setFormError("");
    } else {
      const data = await res.json();
      setFormError(data.error || "更新に失敗しました");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm(`「${customer?.name}」を削除しますか？この操作は取り消せません。`)) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    router.push("/");
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!histForm.product_name.trim()) { setHistError("商品名は必須です"); return; }
    if (!histForm.purchase_date) { setHistError("購入日は必須です"); return; }
    setAddingHist(true);
    const res = await fetch(`/api/customers/${id}/histories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...histForm, amount: Number(histForm.amount) || 0 }),
    });
    if (res.ok) {
      await fetchHistories();
      setHistForm({ purchase_date: "", product_name: "", amount: "", memo: "" });
      setHistError("");
      setShowHistForm(false);
    } else {
      const data = await res.json();
      setHistError(data.error || "登録に失敗しました");
    }
    setAddingHist(false);
  };

  if (!customer) return <p className="text-gray-400 py-10 text-center">読み込み中...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-400 hover:text-gray-600">← 一覧へ</Link>
        <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
      </div>

      {/* 顧客情報カード */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">基本情報</h2>
          <div className="flex gap-2">
            {!editing && (
              <>
                <button onClick={() => setEditing(true)} className="text-sm px-3 py-1 border rounded text-blue-600 border-blue-300 hover:bg-blue-50">
                  編集
                </button>
                <button onClick={handleDelete} className="text-sm px-3 py-1 border rounded text-red-600 border-red-300 hover:bg-red-50">
                  削除
                </button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-3">
            {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{formError}</p>}
            {(["name", "phone", "email"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-600 mb-1">
                  {field === "name" ? "名前 *" : field === "phone" ? "電話番号" : "メール"}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-600 mb-1">メモ</label>
              <textarea
                value={form.memo}
                onChange={(e) => setForm({ ...form, memo: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
                {saving ? "保存中..." : "保存"}
              </button>
              <button type="button" onClick={() => { setEditing(false); setFormError(""); }} className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-50 text-sm">
                キャンセル
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-gray-400">電話番号</dt><dd className="text-gray-800">{customer.phone || "—"}</dd></div>
            <div><dt className="text-gray-400">メール</dt><dd className="text-gray-800">{customer.email || "—"}</dd></div>
            <div className="col-span-2"><dt className="text-gray-400">メモ</dt><dd className="text-gray-800 whitespace-pre-wrap">{customer.memo || "—"}</dd></div>
            <div><dt className="text-gray-400">登録日</dt><dd className="text-gray-400">{customer.created_at}</dd></div>
            <div><dt className="text-gray-400">更新日</dt><dd className="text-gray-400">{customer.updated_at}</dd></div>
          </dl>
        )}
      </div>

      {/* 購入履歴 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">購入履歴</h2>
          <button onClick={() => setShowHistForm(!showHistForm)} className="text-sm px-3 py-1 border rounded text-blue-600 border-blue-300 hover:bg-blue-50">
            {showHistForm ? "キャンセル" : "＋ 追加"}
          </button>
        </div>

        {showHistForm && (
          <form onSubmit={handleAddHistory} className="bg-gray-50 rounded p-4 mb-4 space-y-3">
            {histError && <p className="text-red-600 text-sm">{histError}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">購入日 *</label>
                <input type="date" value={histForm.purchase_date} onChange={(e) => setHistForm({ ...histForm, purchase_date: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">金額 (円)</label>
                <input type="number" value={histForm.amount} onChange={(e) => setHistForm({ ...histForm, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">商品名 *</label>
              <input type="text" value={histForm.product_name} onChange={(e) => setHistForm({ ...histForm, product_name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" placeholder="商品名を入力" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">メモ</label>
              <input type="text" value={histForm.memo} onChange={(e) => setHistForm({ ...histForm, memo: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>
            <button type="submit" disabled={addingHist} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
              {addingHist ? "登録中..." : "登録"}
            </button>
          </form>
        )}

        {histories.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">購入履歴がありません</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-xs border-b">
              <tr>
                <th className="text-left py-2">購入日</th>
                <th className="text-left py-2">商品名</th>
                <th className="text-right py-2">金額</th>
                <th className="text-left py-2 pl-4">メモ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {histories.map((h) => (
                <tr key={h.id}>
                  <td className="py-2 text-gray-600">{h.purchase_date}</td>
                  <td className="py-2 text-gray-800">{h.product_name}</td>
                  <td className="py-2 text-right text-gray-600">¥{h.amount.toLocaleString()}</td>
                  <td className="py-2 pl-4 text-gray-400">{h.memo || "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t">
              <tr>
                <td colSpan={2} className="py-2 text-sm text-gray-500">合計</td>
                <td className="py-2 text-right font-semibold text-gray-800">
                  ¥{histories.reduce((s, h) => s + h.amount, 0).toLocaleString()}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
