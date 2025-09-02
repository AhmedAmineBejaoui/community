"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [edit, setEdit] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { (async () => { const r = await fetch('/api/tasks/' + params.id); const j = await r.json(); if (r.ok) { setItem(j.data); setEdit(j.data); } else { setError('Not found'); } setLoading(false); })(); }, [params.id]);
  const save = async () => { setSaving(true); setError(''); try { const r = await fetch('/api/tasks/' + params.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(edit) }); if (!r.ok) { const j = await r.json(); throw new Error(j?.error || 'Failed'); } router.refresh(); } catch (e: any) { setError(e.message); } finally { setSaving(false); } };
  const remove = async () => { if (!confirm('Delete?')) return; const r = await fetch('/api/tasks/' + params.id, { method: 'DELETE' }); if (r.ok) router.push('/tasks'); };
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">{error}</div>;
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Detail</h1>
        <div className="flex gap-3">
          <Link href="/tasks" className="btn-secondary">Back</Link>
          <button onClick={remove} className="btn-secondary">Delete</button>
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input className="input-field" value={(edit?.title ?? '') as any} onChange={(e) => setEdit((p:any) => ({ ...p, title: e.target.value }))} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><input className="input-field" value={(edit?.description ?? '') as any} onChange={(e) => setEdit((p:any) => ({ ...p, description: e.target.value }))} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label><input className="input-field" value={(edit?.status ?? '') as any} onChange={(e) => setEdit((p:any) => ({ ...p, status: e.target.value }))} /></div>
      </div>
    </div>
  );
}