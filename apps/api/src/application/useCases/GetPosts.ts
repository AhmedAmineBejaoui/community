import { PostRepository } from '../../domain/ports/PostRepository';
import { PostQuery } from '../../domain/entities/Post';

export interface GetPostsRequest {
  query: PostQuery;
}

export interface GetPostsResponse {
  posts: Array<{
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
  }>;
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
}

export class GetPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(request: GetPostsRequest): Promise<GetPostsResponse> {
    const { query } = request;

    const result = await this.postRepository.findMany(query);

    return {
      posts: result.posts,
      hasMore: result.hasMore,
      ...(result.nextCursor !== undefined && { nextCursor: result.nextCursor }),
      ...(result.total !== undefined && { total: result.total }),
    };
  }
}
