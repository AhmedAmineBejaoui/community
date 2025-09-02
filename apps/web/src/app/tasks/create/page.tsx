"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function CreateTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e: any) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const r = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Failed');
      router.push('/tasks/' + j.data.id);
    } catch (e: any) { setError(e.message || 'Failed'); } finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create Task</h1>
        <Link href="/tasks" className="btn-secondary">Back</Link>
      </div>
      <form onSubmit={submit} className="bg-white rounded shadow p-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input className="input-field" value={(form.title ?? '') as any} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input className="input-field" value={(form.description ?? '') as any} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <input className="input-field" value={(form.status ?? '') as any} onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))} />
            </div>
        <div className="flex justify-end gap-3">
          <Link href="/tasks" className="btn-secondary">Cancel</Link>
          <button className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}