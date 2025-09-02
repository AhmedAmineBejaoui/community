'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Message { id?: string; role: 'user' | 'assistant'; content: string; createdAt?: string }

export default function CommunityChatPage() {
  const { slug } = useParams() as { slug: string };
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [community, setCommunity] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);
        // Get community info via existing slug API
        const cRes = await fetch(`/api/communities/${slug}`);
        if (!cRes.ok) throw new Error('Community not found');
        const cData = await cRes.json();
        const communityId = cData.data.id;
        setCommunity({ id: communityId, name: cData.data.name });

        // Create a chat session
        const sRes = await fetch('/api/bff/chat/sessions', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ communityId })
        });
        const sData = await sRes.json();
        if (!sRes.ok) throw new Error(sData?.error?.message || 'Failed to create session');
        setSessionId(sData.data.id);

        // Load messages (will be empty at start)
        const mRes = await fetch(`/api/bff/chat/sessions/${sData.data.id}/messages`, { cache: 'no-store' });
        const mData = await mRes.json();
        if (mRes.ok && Array.isArray(mData.data)) setMessages(mData.data);
      } catch (e: any) { setError(e.message || 'Initialization failed'); }
      finally { setLoading(false); }
    };
    bootstrap();
  }, [slug]);

  const send = async () => {
    if (!input.trim() || !sessionId) return;
    setSending(true); setError('');
    const content = input.trim();
    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');
    try {
      // Send message
      const r = await fetch('/api/bff/chat/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, content })
      });
      if (!r.ok) {
        const j = await r.json().catch(()=>null);
        throw new Error(j?.error?.message || 'Send failed');
      }
      // Optimistic: poll once more after a short delay to retrieve assistant reply
      setTimeout(async () => {
        const mRes = await fetch(`/api/bff/chat/sessions/${sessionId}/messages`, { cache: 'no-store' });
        const mData = await mRes.json();
        if (mRes.ok && Array.isArray(mData.data)) setMessages(mData.data);
      }, 800);
    } catch (e: any) {
      setError(e.message || 'Send failed');
    } finally { setSending(false); }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold">Chat – {community?.name}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card" style={{ height: '60vh', overflow: 'auto' }}>
          {messages.length === 0 && (
            <div className="text-gray-500">Démarrez la conversation…</div>
          )}
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`${m.role === 'user' ? 'bg-primary-600 text-white ml-auto' : 'bg-gray-100 text-gray-800 mr-auto'} max-w-[80%] rounded-lg px-3 py-2 inline-block`}>{m.content}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <input className="input-field flex-1" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } }} placeholder="Écrire un message…" />
          <button className="btn-primary" onClick={send} disabled={sending || !sessionId}>{sending ? 'Envoi…' : 'Envoyer'}</button>
        </div>
      </div>
    </div>
  );
}

