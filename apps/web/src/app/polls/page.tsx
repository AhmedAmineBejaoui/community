'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PollPost {
  id: string;
  title: string;
  content?: string;
  community: {
    slug: string;
    name: string;
  };
  author: {
    fullName: string;
  };
  createdAt: string;
  extra: {
    options?: string[];
    duration?: number;
    totalVotes?: number;
  };
}

export default function PollsPage() {
  const [polls, setPolls] = useState<PollPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [communities, setCommunities] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch('/api/communities');
        if (response.ok) {
          const data = await response.json();
          setCommunities(data.data || []);
        }
      } catch (error) {
        console.error('Failed to load communities');
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        let url = '/api/posts?type=POLL&limit=50';
        if (selectedCommunity !== 'all') {
          url += `&communityId=${selectedCommunity}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPolls(data.data);
        }
      } catch (error) {
        console.error('Failed to load polls');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, [selectedCommunity]);

  const getPollStatus = (poll: PollPost) => {
    if (!poll.extra.duration) return 'Active';
    
    const createdAt = new Date(poll.createdAt);
    const endDate = new Date(createdAt.getTime() + (poll.extra.duration * 24 * 60 * 60 * 1000));
    const now = new Date();
    
    if (now > endDate) {
      return 'Closed';
    }
    
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  };

  const getPollStatusColor = (status: string) => {
    if (status === 'Closed') return 'bg-gray-100 text-gray-800';
    if (status.includes('day')) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading polls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Community Polls</h1>
            <p className="mt-2 text-gray-600">Vote on important community decisions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="community-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Community
              </label>
              <select
                id="community-filter"
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="all">All Communities</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Polls List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {polls.length > 0 ? (
          <div className="space-y-6">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">📊</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPollStatusColor(getPollStatus(poll))}`}>
                        {getPollStatus(poll)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/c/${poll.community.slug}/posts/${poll.id}`} className="hover:text-blue-600">
                        {poll.title}
                      </Link>
                    </h3>
                    
                    {poll.content && (
                      <p className="text-gray-600 mb-4">{poll.content}</p>
                    )}
                    
                    {poll.extra.options && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {poll.extra.options.map((option, index) => (
                            <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>by {poll.author.fullName}</span>
                        <span>in {poll.community.name}</span>
                      </div>
                      <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {poll.extra.totalVotes !== undefined && (
                      <div className="mt-3 text-sm text-gray-500">
                        🗳️ {poll.extra.totalVotes} vote{poll.extra.totalVotes !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No polls found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCommunity !== 'all'
                ? 'No polls have been created in this community yet.'
                : 'No polls have been created yet.'
              }
            </p>
            <Link href="/" className="btn-primary">
              Browse Communities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
