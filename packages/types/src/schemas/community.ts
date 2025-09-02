import { z } from 'zod';

export const CreateCommunitySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  joinPolicy: z.enum(['INVITE_ONLY', 'REQUEST_APPROVAL', 'CODE']).default('INVITE_ONLY'),
});

export const UpdateCommunitySchema = CreateCommunitySchema.partial().omit({ slug: true });

export const ApproveMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['ADMIN', 'MODERATOR', 'RESIDENT']).default('RESIDENT'),
});

export const communitySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  joinPolicy: z.enum(['INVITE_ONLY', 'REQUEST_APPROVAL', 'CODE']),
  createdAt: z.date(),
});

export const communityWithMembersSchema = communitySchema.extend({
  members: z.array(z.object({
    id: z.string(),
    userId: z.string(),
    role: z.enum(['ADMIN', 'MODERATOR', 'RESIDENT']),
    user: z.object({
      id: z.string(),
      email: z.string(),
      fullName: z.string(),
      status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']),
    }),
  })),
});

export type CreateCommunityDto = z.infer<typeof CreateCommunitySchema>;
export type UpdateCommunityDto = z.infer<typeof UpdateCommunitySchema>;
export type ApproveMemberDto = z.infer<typeof ApproveMemberSchema>;
export type Community = z.infer<typeof communitySchema>;
export type CommunityWithMembers = z.infer<typeof communityWithMembersSchema>;
