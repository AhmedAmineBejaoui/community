'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserDetail {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  _count?: { memberships: number };
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserDetail['role']>('USER');
  const [status, setStatus] = useState<UserDetail['status']>('ACTIVE');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${params.id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load user');
        const j = await res.json();
        setUser(j.user);
        setName(j.user.fullName || '');
        setRole(j.user.role || 'USER');
        setStatus(j.user.status || 'ACTIVE');
      } catch (e: any) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchUser();
  }, [params.id]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error || !user) return (
    <div className="p-6">
      <p className="text-red-600">{error || 'Utilisateur introuvable'}</p>
      <Link href="/admin" className="btn-secondary mt-4 inline-block">Retour</Link>
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, role, status })
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j?.error || 'Échec de la mise à jour'); }
      const j = await res.json();
      setUser(j.user);
    } catch (e: any) {
      setError(e.message || 'Erreur');
    } finally { setSaving(false); }
  };

  const remove = async () => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700 transition-colors">← Retour</Link>
              <h1 className="text-2xl font-bold text-gray-900">Utilisateur</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <input className="input-field" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input className="input-field" value={user.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
              <select className="input-field" value={role} onChange={(e)=>setRole(e.target.value as any)}>
                <option value="USER">USER</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select className="input-field" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
                <option value="PENDING">PENDING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button className="btn-secondary" onClick={remove}>Supprimer</button>
            <button className="btn-primary" disabled={saving} onClick={save}>{saving ? 'Sauvegarde...' : 'Enregistrer'}</button>
          </div>
        </div>

        <div className="card">
          <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-800">Créé le</div>
              <div>{new Date(user.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="font-medium text-gray-800">Communautés</div>
              <div>{user._count?.memberships ?? 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
