/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = unknown> {
  Code: number;
  Message: string;
  Data: T;
  Status: boolean;
}

export interface UserInfo {
  id: string;
  userName: string;
  token: string;
  email: string;
  jobTitle: string;
  userImage: string;
}