export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  home_lat: number | null;
  home_lng: number | null;
  work_lat: number | null;
  work_lng: number | null;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
