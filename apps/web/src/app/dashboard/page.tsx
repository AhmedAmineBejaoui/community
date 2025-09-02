"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  community: { slug: string; name: string };
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"communities" | "activity">("communities");

  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["user-communities"],
    queryFn: async () => {
      const response = await fetch("/api/communities/user?limit=20", {
        cache: "force-cache",
        headers: { Authorization: `Bearer ${(session?.user as any)?.id}` },
      });
      if (!response.ok) throw new Error("Failed to fetch communities");
      return response.json();
    },
    enabled: !!(session?.user as any)?.id,
  });

  const { data: recentActivity = [] } = useQuery<Post[]>({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const response = await fetch("/api/posts/recent?limit=10", {
        cache: "force-cache",
        headers: { Authorization: `Bearer ${(session?.user as any)?.id}` },
      });
      if (!response.ok) throw new Error("Failed to fetch recent activity");
      return response.json();
    },
    enabled: !!(session?.user as any)?.id,
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Please log in to access your dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your communities and activity feed live here.
          </p>
          <Link href="/login" className="btn-primary px-5 py-2">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{session.user?.name || session.user?.email}</span>
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="badge-blue">{(session.user as any)?.role || 'USER'}</span>
            <span className="text-sm text-gray-500">{communities.length} communities • {recentActivity.length} recent posts</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-xl p-1 inline-flex mb-6">
          <button
            onClick={() => setActiveTab("communities")}
            className={`${activeTab === 'communities' ? 'btn-primary' : 'btn-outline'} px-4 py-2 rounded-lg`}
          >
            My Communities
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`${activeTab === 'activity' ? 'btn-primary' : 'btn-outline'} px-4 py-2 rounded-lg ml-2`}
          >
            Recent Activity
          </button>
        </div>

        {/* Content */}
        {activeTab === "communities" && (
          <div className="space-y-4">
            {communities.length === 0 ? (
              <div className="card text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No communities yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Join a community to get started!</p>
                <Link href="/join" className="btn-primary px-4 py-2">Join Community</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <div key={community.id} className="card card-hover">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-brand-500 text-white flex items-center justify-center shadow-glow">
                        <span className="font-bold text-sm">{community.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">{community.name}</h3>
                        <p className="text-sm text-gray-500">{community.memberCount} members</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{community.description}</p>
                    <div className="mt-6 flex justify-between items-center">
                      <Link href={`/c/${community.slug}`} className="btn-secondary px-3 py-2">View Community</Link>
                      <span className="badge-purple">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="card text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No recent activity</h3>
                <p className="text-gray-600 dark:text-gray-300">Activity from your communities will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((post) => (
                  <div key={post.id} className="card card-hover">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">in {post.community.name} • {post.type}</p>
                      </div>
                      <span className="badge-blue">{post.type}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.content}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                      <Link href={`/c/${post.community.slug}`} className="link-primary text-sm">View in Community</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

