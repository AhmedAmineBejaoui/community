import { PostRepository } from "../../domain/ports/PostRepository";
import { CreatePostData, Post } from "../../domain/entities/Post";

export interface CreatePostRequest {
  dto: CreatePostData;
  userId: string;
}

export interface CreatePostResponse {
  post: Post;
}

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(request: CreatePostRequest): Promise<CreatePostResponse> {
    const { dto, userId } = request;

    // Validate that the user is a member of the community
    // This would typically be done through a separate service or repository

    const post = await this.postRepository.create({
      ...dto,
      authorId: userId,
    });

    return { post };
  }
}
