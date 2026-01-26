export interface User {
  id: number;
  email: string;
  role_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Owner extends User {
  business_name: string,
  phone: string,
  address: string,
  city: string
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}