export type Role = 'ADMIN' | 'MODERATOR' | 'RESIDENT';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';
export type JoinPolicy = 'INVITE_ONLY' | 'REQUEST_APPROVAL' | 'CODE';
export type PostType = 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';

export interface PaginationParams {
  limit: number;
  cursor?: string;
}

export interface PaginationResult<T> {
  data: T[];
  paging: {
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface UserContext {
  id: string;
  email: string;
  fullName: string;
  memberships: Array<{
    communityId: string;
    role: Role;
  }>;
}

export interface UploadPresignedUrl {
  url: string;
  fields: Record<string, string>;
  expiresAt: Date;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  joinPolicy: 'INVITE_ONLY' | 'REQUEST_APPROVAL' | 'CODE';
  inviteCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  type: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  title: string;
  content?: string;
  images: string[];
  extra?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatSession {
  id: string;
  communityId: string;
  userId?: string;
  status: string;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  tokens?: number;
  latencyMs?: number;
  createdAt: Date;
}
