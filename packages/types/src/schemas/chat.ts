import { z } from 'zod';

export const CreateChatSessionSchema = z.object({
  communityId: z.string(),
  userId: z.string().optional(),
});

export const CreateChatMessageSchema = z.object({
  sessionId: z.string(),
  content: z.string().min(1).max(2000),
  role: z.enum(['user', 'assistant', 'system']).default('user'),
});

export const N8nCallbackSchema = z.object({
  sessionId: z.string(),
  reply: z.string(),
  usage: z.any().optional(),
  latency: z.number().optional(),
});

export type CreateChatSessionDto = z.infer<typeof CreateChatSessionSchema>;
export type CreateChatMessageDto = z.infer<typeof CreateChatMessageSchema>;
export type N8nCallbackDto = z.infer<typeof N8nCallbackSchema>;
