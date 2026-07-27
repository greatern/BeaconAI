import { api } from "../../lib/api";
import type { LoginPayload, RegisterPayload, TokenResponse, User } from "./types";

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/register", payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}
