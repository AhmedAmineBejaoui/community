export interface Community {
  id: string;
  name: string;
  slug: string;
  joinPolicy: 'INVITE_ONLY' | 'REQUEST_APPROVAL' | 'CODE';
  createdAt: Date;
}

export interface CreateCommunityData {
  name: string;
  slug: string;
  joinPolicy?: 'INVITE_ONLY' | 'REQUEST_APPROVAL' | 'CODE';
}

export interface UpdateCommunityData {
  name?: string;
  slug?: string;
  joinPolicy?: 'INVITE_ONLY' | 'REQUEST_APPROVAL' | 'CODE';
}
