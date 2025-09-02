import { z } from 'zod';

export const PaginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const IdSchema = z.string().min(1);

export type PaginationDto = z.infer<typeof PaginationSchema>;
export type IdDto = z.infer<typeof IdSchema>;
