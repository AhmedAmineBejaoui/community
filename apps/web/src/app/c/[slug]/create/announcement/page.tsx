'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateAnnouncement() {
  const { slug } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Lookup community id
      const cRes = await fetch(`/api/communities/${slug}`);
      if (!cRes.ok) throw new Error('Community not found');
      const cData = await cRes.json();
      const communityId = cData.data.id;

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityId,
          title,
          content,
          type: 'ANNOUNCEMENT',
          images: [],
        }),
      });
      if (!res.ok) {
        const er = await res.json();
        throw new Error(er?.error?.message || 'Failed to create');
      }
      const data = await res.json();
      router.push(`/c/${slug}/posts/${data.data.id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to create');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Create Announcement</h1>
          <Link href={`/c/${slug}`} className="btn-secondary">Back to Community</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={submit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required placeholder="Enter your announcement title..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input-field" rows={4} placeholder="Describe your announcement..." />
            </div>

            <div className="flex justify-end gap-3">
              <Link href={`/c/${slug}`} className="btn-secondary">Cancel</Link>
              <button type="submit" disabled={isLoading || !title.trim()} className="btn-primary">
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

