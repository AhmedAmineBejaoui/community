import { PostRepository } from '../../domain/ports/PostRepository';
import { Post, CreatePostData, UpdatePostData, PostQuery } from '../../domain/entities/Post';
import { prisma } from '../prisma';

export class PrismaPostRepository implements PostRepository {
  async findById(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) return null;

    return {
      id: post.id,
      communityId: post.communityId,
      authorId: post.authorId,
      type: post.type as Post['type'],
      title: post.title,
      content: post.content || undefined,
      images: post.images,
      extra: post.extra as Record<string, unknown> || undefined,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async findMany(query: PostQuery): Promise<{
    posts: Post[];
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  }> {
    const { communityId, type, search, limit, cursor } = query;

    const where: any = {};
    if (communityId) where.communityId = communityId;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    const hasMore = posts.length > limit;
    const actualPosts = hasMore ? posts.slice(0, -1) : posts;
    const nextCursor = hasMore ? posts[posts.length - 2]?.id : undefined;

    return {
      posts: actualPosts.map((post: any) => ({
        id: post.id,
        communityId: post.communityId,
        authorId: post.authorId,
        type: post.type as Post['type'],
        title: post.title,
        content: post.content || undefined,
        images: post.images,
        extra: post.extra as Record<string, unknown> || undefined,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
      hasMore,
      nextCursor,
    };
  }

  async create(data: CreatePostData): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        communityId: data.communityId,
        authorId: data.authorId,
        type: data.type,
        title: data.title,
        content: data.content,
        images: data.images || [],
        extra: data.extra,
      },
    });

    return {
      id: post.id,
      communityId: post.communityId,
      authorId: post.authorId,
      type: post.type as Post['type'],
      title: post.title,
      content: post.content || undefined,
      images: post.images,
      extra: post.extra as Record<string, unknown> || undefined,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async update(id: string, data: UpdatePostData): Promise<Post> {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        images: data.images,
        extra: data.extra,
      },
    });

    return {
      id: post.id,
      communityId: post.communityId,
      authorId: post.authorId,
      type: post.type as Post['type'],
      title: post.title,
      content: post.content || undefined,
      images: post.images,
      extra: post.extra as Record<string, unknown> || undefined,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }

  async findByCommunity(communityId: string, type?: string): Promise<Post[]> {
    const where: any = { communityId };
    if (type) where.type = type;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return posts.map((post: any) => ({
      id: post.id,
      communityId: post.communityId,
      authorId: post.authorId,
      type: post.type as Post['type'],
      title: post.title,
      content: post.content || undefined,
      images: post.images,
      extra: post.extra as Record<string, unknown> || undefined,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }

  async search(query: string, communityId?: string): Promise<Post[]> {
    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (communityId) where.communityId = communityId;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return posts.map((post: any) => ({
      id: post.id,
      communityId: post.communityId,
      authorId: post.authorId,
      type: post.type as Post['type'],
      title: post.title,
      content: post.content || undefined,
      images: post.images,
      extra: post.extra as Record<string, unknown> || undefined,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }
}
