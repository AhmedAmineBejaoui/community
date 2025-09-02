export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateUserData {
  fullName?: string;
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  lastLoginAt?: Date;
}
