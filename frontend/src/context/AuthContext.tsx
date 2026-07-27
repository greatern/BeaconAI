import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { TOKEN_STORAGE_KEY } from "../lib/api";
import * as authApi from "../features/auth/api";
import type { LoginPayload, RegisterPayload, User } from "../features/auth/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload: LoginPayload) {
    const { access_token } = await authApi.login(payload);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);

    const me = await authApi.getMe();
    setUser(me);
  }

  async function register(payload: RegisterPayload) {
    await authApi.register(payload);
    await login({ email: payload.email, password: payload.password });
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
