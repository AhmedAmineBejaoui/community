"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TaskListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const r = await fetch('/api/tasks'); const j = await r.json(); setItems(j.data || []); setLoading(false); })(); }, []);
  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Task</h1>
        <Link href="/tasks/create" className="btn-primary">Create</Link>
      </div>
      <div className="bg-white rounded shadow">
        <ul>
          {items.map((it) => (
            <li key={it.id} className="border-b p-4 flex items-center justify-between">
              <div className="truncate">{it.id}</div>
              <Link className="text-blue-600" href={'/tasks/' + it.id}>View</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}