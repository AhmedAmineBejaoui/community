export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  type: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  title: string;
  content?: string;
  images: string[];
  extra?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostData {
  communityId: string;
  authorId: string;
  type: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  title: string;
  content?: string;
  images?: string[];
  extra?: Record<string, unknown>;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  images?: string[];
  extra?: Record<string, unknown>;
}

export interface PostQuery {
  communityId?: string;
  type?: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  search?: string;
  limit: number;
  cursor?: string;
}
