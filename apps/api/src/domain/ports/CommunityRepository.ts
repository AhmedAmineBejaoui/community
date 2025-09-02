import { Community, CreateCommunityData, UpdateCommunityData } from '../entities/Community';

export interface CommunityRepository {
  findById(id: string): Promise<Community | null>;
  findBySlug(slug: string): Promise<Community | null>;
  create(data: CreateCommunityData): Promise<Community>;
  update(id: string, data: UpdateCommunityData): Promise<Community>;
  delete(id: string): Promise<void>;
  findMembers(id: string): Promise<Array<{
    id: string;
    userId: string;
    role: 'ADMIN' | 'MODERATOR' | 'RESIDENT';
    user: {
      id: string;
      email: string;
      fullName: string;
      status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    };
  }>>;
}
