'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content?: string;
  type: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  createdAt: string;
  author: {
    fullName: string;
  };
  _count?: {
    comments: number;
  };
}

export default function CommunityPosts() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = `/api/posts?communityId=${slug}&limit=50`;
        if (selectedType !== 'all') {
          url += `&type=${selectedType.toUpperCase()}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.data);
        }
      } catch (error) {
        console.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPosts();
    }
  }, [slug, selectedType, searchQuery]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return 'bg-blue-100 text-blue-800';
      case 'SERVICE':
        return 'bg-green-100 text-green-800';
      case 'LISTING':
        return 'bg-yellow-100 text-yellow-800';
      case 'POLL':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return '📢';
      case 'SERVICE':
        return '🤝';
      case 'LISTING':
        return '🏷️';
      case 'POLL':
        return '📊';
      default:
        return '📝';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Posts</h1>
              <p className="mt-2 text-gray-600">Stay updated with what's happening in your neighborhood</p>
            </div>
            <Link href={`/c/${slug}/create`} className="btn-primary">
              Create Post
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex-1">
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                id="type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="all">All Types</option>
                <option value="announcement">Announcements</option>
                <option value="service">Services</option>
                <option value="listing">Listings</option>
                <option value="poll">Polls</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Posts
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field max-w-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(post.type)}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                        {post.type}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/c/${slug}/posts/${post.id}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    
                    {post.content && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>by {post.author.fullName}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {post._count?.comments !== undefined && (
                      <div className="mt-3 text-sm text-gray-500">
                        💬 {post._count.comments} comment{post._count.comments !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a post in this community!'
              }
            </p>
            <Link href={`/c/${slug}/create`} className="btn-primary">
              Create First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
