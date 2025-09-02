'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateListing() {
  const { slug } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState<number | ''>('' as any);
  const [condition, setCondition] = useState<'NEW'|'LIKE_NEW'|'GOOD'|'FAIR'|'POOR'>('GOOD');
  const [availability, setAvailability] = useState<'AVAILABLE'|'SOLD'|'RENTED'>('AVAILABLE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
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
          type: 'LISTING',
          images: [],
          extra: {
            price: typeof price === 'number' ? price : 0,
            condition,
            availability,
          },
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
          <h1 className="text-3xl font-bold text-gray-900">List Item</h1>
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
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required placeholder="Item title..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input-field" rows={4} placeholder="Describe the item..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input type="number" min="0" step="0.01" value={price as any}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="input-field pl-7" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value as any)} className="input-field">
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select value={availability} onChange={(e) => setAvailability(e.target.value as any)} className="input-field">
                  <option value="AVAILABLE">Available</option>
                  <option value="SOLD">Sold</option>
                  <option value="RENTED">Rented</option>
                </select>
              </div>
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

