'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface PostDetail {
  id: string;
  title: string;
  content?: string;
  type: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  images: string[];
  extra?: Record<string, any> | null;
  createdAt: string;
  community: { slug: string; name: string };
  author: { fullName: string };
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;
  const id = params.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [extra, setExtra] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setPost(data.data);
        } else {
          setError('Post not found');
        }
      } catch (e) {
        setError('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content || '');
      setExtra((post.extra as any) || {});
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Post not found'}</h1>
          <Link href={`/c/${slug}`} className="btn-primary">Back to Community</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
              <h1 className="text-3xl font-bold text-gray-900">{editing ? (
                <input className="input-field" value={title} onChange={(e)=>setTitle(e.target.value)} />
              ) : post.title}</h1>
              <p className="mt-1 text-gray-600">in {post.community.name} • by {post.author.fullName}</p>
              </div>
            <div className="flex gap-3">
              {(session?.user as any) && (
                <>
                  <button className="btn-secondary" onClick={()=>setEditing((v)=>!v)}>{editing ? 'Annuler' : 'Éditer'}</button>
                  {editing && (
                    <button className="btn-primary" onClick={async()=>{
                      const res = await fetch(`/api/posts/${id}`,{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, content, extra }) });
                      if(res.ok){ router.refresh(); setEditing(false); }
                    }}>Enregistrer</button>
                  )}
                  <button className="btn-secondary" onClick={async()=>{ if(!confirm('Supprimer ce post ?')) return; const r=await fetch(`/api/posts/${id}`,{method:'DELETE'}); if(r.ok){ router.push(`/c/${slug}/annonces`);} }}>Supprimer</button>
                </>
              )}
              <Link href={`/c/${slug}`} className="btn-secondary">Back</Link>
            </div>
            </div>
          </div>
        </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Images */}
        {post.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {post.images.map((src, i) => (
              <img key={i} src={src} alt={`image-${i}`} className="w-full h-56 object-cover rounded" />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none mb-6">
          {editing ? (
            <textarea className="input-field" rows={6} value={content} onChange={(e)=>setContent(e.target.value)} />
          ) : (
            post.content && <p>{post.content}</p>
          )}
        </div>

        {/* Extra fields by type */}
        {post.type === 'LISTING' && (post.extra || editing) && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-medium mb-2">Listing Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <dt className="font-medium">Price</dt>
                <dd>
                  {editing ? (
                    <input type="number" className="input-field" value={extra?.price ?? ''} onChange={(e)=>setExtra(p=>({ ...p, price: parseFloat(e.target.value)||0 }))} />
                  ) : (
                    post.extra && '$'+Number((post.extra as any).price).toFixed(2)
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Condition</dt>
                <dd>
                  {editing ? (
                    <select className="input-field" value={extra?.condition ?? 'GOOD'} onChange={(e)=>setExtra(p=>({ ...p, condition: e.target.value }))}>
                      <option value="NEW">New</option>
                      <option value="LIKE_NEW">Like New</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIR">Fair</option>
                      <option value="POOR">Poor</option>
                    </select>
                  ) : (
                    post.extra && String((post.extra as any).condition)
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Availability</dt>
                <dd>
                  {editing ? (
                    <select className="input-field" value={extra?.availability ?? 'AVAILABLE'} onChange={(e)=>setExtra(p=>({ ...p, availability: e.target.value }))}>
                      <option value="AVAILABLE">Available</option>
                      <option value="SOLD">Sold</option>
                      <option value="RENTED">Rented</option>
                    </select>
                  ) : (
                    post.extra && String((post.extra as any).availability)
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {post.type === 'SERVICE' && (post.extra || editing) && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-medium mb-2">Service Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <dt className="font-medium">Priority</dt>
                <dd>
                  {editing ? (
                    <select className="input-field" value={extra?.priority ?? 'MEDIUM'} onChange={(e)=>setExtra(p=>({ ...p, priority: e.target.value }))}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  ) : (
                    post.extra && String((post.extra as any).priority)
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Status</dt>
                <dd>
                  {editing ? (
                    <select className="input-field" value={extra?.status ?? 'OPEN'} onChange={(e)=>setExtra(p=>({ ...p, status: e.target.value }))}>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  ) : (
                    post.extra && String((post.extra as any).status)
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Service Type</dt>
                <dd>
                  {editing ? (
                    <input className="input-field" value={extra?.serviceType ?? ''} onChange={(e)=>setExtra(p=>({ ...p, serviceType: e.target.value }))} />
                  ) : (
                    post.extra && String((post.extra as any).serviceType)
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
