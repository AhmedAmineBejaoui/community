'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CreatePostForm {
  title: string;
  content: string;
  type: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  images: string[];
  extra: Record<string, any>;
}

export default function CreatePost() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [form, setForm] = useState<CreatePostForm>({
    title: '',
    content: '',
    type: (searchParams.get('type') as any) || 'ANNOUNCEMENT',
    images: [],
    extra: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First get the community ID
      const communityResponse = await fetch(`/api/communities/${slug}`);
      if (!communityResponse.ok) {
        throw new Error('Community not found');
      }
      
      const communityData = await communityResponse.json();
      const communityId = communityData.data.id;

      // Create the post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          communityId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to community posts list where the new post will appear
        router.push(`/c/${slug}/annonces`);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Failed to create post');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setForm(prev => ({ ...prev, type: type as any, extra: {} }));
  };

  const renderExtraFields = () => {
    switch (form.type) {
      case 'SERVICE':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={form.extra.priority || 'MEDIUM'}
                onChange={(e) => setForm(prev => ({ 
                  ...prev, 
                  extra: { ...prev.extra, priority: e.target.value } 
                }))}
                className="input-field"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                placeholder="e.g., Gardening, Cleaning, Repair"
                value={form.extra.serviceType || ''}
                onChange={(e) => setForm(prev => ({ 
                  ...prev, 
                  extra: { ...prev.extra, serviceType: e.target.value } 
                }))}
                className="input-field"
              />
            </div>
          </div>
        );

      case 'LISTING':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.extra.price || ''}
                  onChange={(e) => setForm(prev => ({ 
                    ...prev, 
                    extra: { ...prev.extra, price: parseFloat(e.target.value) || 0 } 
                  }))}
                  className="input-field pl-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={form.extra.condition || 'GOOD'}
                onChange={(e) => setForm(prev => ({ 
                  ...prev, 
                  extra: { ...prev.extra, condition: e.target.value } 
                }))}
                className="input-field"
              >
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
            </div>
          </div>
        );

      case 'POLL':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Options (one per line)
              </label>
              <textarea
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                value={form.extra.options || ''}
                onChange={(e) => {
                  const options = e.target.value.split('\n').filter(opt => opt.trim());
                  setForm(prev => ({ 
                    ...prev, 
                    extra: { ...prev.extra, options } 
                  }));
                }}
                rows={4}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Duration (days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.extra.duration || 7}
                onChange={(e) => setForm(prev => ({ 
                  ...prev, 
                  extra: { ...prev.extra, duration: parseInt(e.target.value) || 7 } 
                }))}
                className="input-field"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
              <p className="mt-2 text-gray-600">Share something with your community</p>
            </div>
            <Link href={`/c/${slug}`} className="btn-secondary">
              Back to Community
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'ANNOUNCEMENT', label: 'Announcement', icon: '📢' },
                  { value: 'SERVICE', label: 'Service', icon: '🤝' },
                  { value: 'LISTING', label: 'Listing', icon: '🏷️' },
                  { value: 'POLL', label: 'Poll', icon: '📊' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      form.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder={`Enter your ${form.type.toLowerCase()} title...`}
                className="input-field"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                rows={4}
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder={`Describe your ${form.type.toLowerCase()}...`}
                className="input-field"
              />
            </div>

            {/* Extra Fields */}
            {renderExtraFields()}

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link href={`/c/${slug}`} className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || !form.title.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
