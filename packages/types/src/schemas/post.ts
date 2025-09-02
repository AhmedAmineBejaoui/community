import { z } from 'zod';

export const CreatePostSchema = z.object({
  communityId: z.string(),
  type: z.enum(['ANNOUNCEMENT', 'SERVICE', 'LISTING', 'POLL']),
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  extra: z.record(z.any()).optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial().omit({ communityId: true });

export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const VoteSchema = z.object({
  option: z.string(),
});

export const ServiceUpdateSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  assigneeId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export const ListingUpdateSchema = z.object({
  availability: z.enum(['AVAILABLE', 'SOLD', 'RENTED']),
  price: z.number().positive().optional(),
});

export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
export type VoteDto = z.infer<typeof VoteSchema>;
export type ServiceUpdateDto = z.infer<typeof ServiceUpdateSchema>;
export type ListingUpdateDto = z.infer<typeof ListingUpdateSchema>;
