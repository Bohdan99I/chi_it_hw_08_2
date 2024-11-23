export interface IUser {
  id: number;
  username: string;
  token?: string;
}

export interface IPost {
  id: number;
  imageUrl: string;
  description: string;
  user: {
    id: number;
    username: string;
  };
  commentCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IComment {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {}
