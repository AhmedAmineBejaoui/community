'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: {
    members: number;
    posts: number;
  };
}

interface Post {
  id: string;
  title: string;
  content?: string;
  type: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  createdAt: string;
  author: {
    fullName: string;
  };
}

export default function CommunityDashboard() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`/api/communities/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setCommunity(data.data);
        } else {
          setError('Community not found');
        }
      } catch (error) {
        setError('Failed to load community');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCommunity();
    }
  }, [slug]);

  useEffect(() => {
    const loadPosts = async () => {
      if (!community?.id) return;
      try {
        const response = await fetch(`/api/posts?communityId=${community.id}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.data);
        }
      } catch (error) {
        console.error('Failed to load posts');
      }
    };
    loadPosts();
  }, [community?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The community you are looking for does not exist.'}</p>
                     <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
             Go Home
           </Link>
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
              <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
              {community.description && (
                <p className="mt-2 text-gray-600">{community.description}</p>
              )}
            </div>
            <div className="flex space-x-4">
                             <Link href={`/c/${slug}/annonces`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                 View All Posts
               </Link>
               <Link href={`/c/${slug}/create`} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                 Create Post
               </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="border-t border-gray-200 py-4">
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{community._count.members}</div>
                <div className="text-sm text-gray-500">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{community._count.posts}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link href={`/c/${slug}/posts/${post.id}`} className="hover:text-blue-600">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            by {post.author.fullName} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.type === 'ANNOUNCEMENT' ? 'bg-blue-100 text-blue-800' :
                          post.type === 'SERVICE' ? 'bg-green-100 text-green-800' :
                          post.type === 'LISTING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {post.type}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No posts yet. Be the first to create one!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href={`/c/${slug}/create/announcement`} className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Announcement
                </Link>
                <Link href={`/c/${slug}/create/service`} className="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  Request Service
                </Link>
                <Link href={`/c/${slug}/create/listing`} className="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  List Item
                </Link>
              </div>
            </div>

            {/* Community Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Community Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Slug:</strong> {community.slug}</p>
                <p><strong>Members:</strong> {community._count.members}</p>
                <p><strong>Posts:</strong> {community._count.posts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
