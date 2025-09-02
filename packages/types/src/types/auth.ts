import { Role } from './common';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  memberships: Array<{
    communityId: string;
    role: 'ADMIN' | 'MODERATOR' | 'RESIDENT';
  }>;
}

export interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  memberships: Array<{
    communityId: string;
    role: 'ADMIN' | 'MODERATOR' | 'RESIDENT';
  }>;
  iat: number;
  exp: number;
}

export interface NextAuthUser {
  id: string;
  email: string;
  fullName: string;
  status: string;
}

export interface NextAuthAccount {
  provider: string;
  type: string;
  providerAccountId: string;
  access_token?: string;
  expires_at?: number;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface NextAuthSession {
  user: NextAuthUser;
  expires: string;
  accessToken?: string;
}

export interface AuthConfig {
  secret: string;
  providers: Array<{
    id: string;
    name: string;
    type: string;
    config: Record<string, unknown>;
  }>;
  adapter: string;
  session: {
    strategy: 'jwt';
    maxAge: number;
  };
  callbacks: {
    jwt: (token: any, user: any) => any;
    session: (session: any, token: any) => any;
  };
}
