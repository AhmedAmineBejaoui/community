import { UserContext } from './common';

export interface AuthenticatedRequest {
  user: UserContext;
}

export interface RequestWithPagination {
  query: {
    limit?: string;
    cursor?: string;
    [key: string]: string | string[] | undefined;
  };
}

export interface RequestWithBody<T> {
  body: T;
}

export interface RequestWithParams<T> {
  params: T;
}

export type AuthenticatedRequestWithBody<T> = AuthenticatedRequest & RequestWithBody<T>;
export type AuthenticatedRequestWithParams<T> = AuthenticatedRequest & RequestWithParams<T>;
export type AuthenticatedRequestWithPagination = AuthenticatedRequest & RequestWithPagination;

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

export interface ApiResponse<T = any> {
  data: T;
  paging?: {
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginationQuery {
  limit?: number;
  cursor?: string;
}

export interface PostQuery extends PaginationQuery {
  communityId?: string;
  type?: 'ANNOUNCEMENT' | 'SERVICE' | 'LISTING' | 'POLL';
  search?: string;
}
