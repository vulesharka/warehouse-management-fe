export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}
