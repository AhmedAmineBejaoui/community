import { Post, CreatePostData, UpdatePostData, PostQuery } from '../entities/Post';

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findMany(query: PostQuery): Promise<{
    posts: Post[];
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  }>;
  create(data: CreatePostData): Promise<Post>;
  update(id: string, data: UpdatePostData): Promise<Post>;
  delete(id: string): Promise<void>;
  findByCommunity(communityId: string, type?: string): Promise<Post[]>;
  search(query: string, communityId?: string): Promise<Post[]>;
}
