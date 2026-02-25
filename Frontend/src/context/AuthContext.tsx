import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";

type AuthUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string;
} | null;

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type AuthContextType = {
  user: AuthUser;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  refreshSession: () => Promise<void>;
  login: (input: LoginInput) => Promise<AuthUser>;
  googleLogin: (idToken: string, rememberMe?: boolean) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MANUAL_LOGOUT_KEY = "auth:manual_logout";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    if (sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "1") {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const res = await axios.get(apiUrl("/api/auth/me"), {
        withCredentials: true,
        headers: { "Cache-Control": "no-cache" },
        params: { t: Date.now() },
      });
      setUser(res.data || null);
    } catch {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }: LoginInput) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    await axios.post(
      apiUrl("/api/auth/login"),
      { email: normalizedEmail, password, rememberMe: !!rememberMe },
      { withCredentials: true }
    );

    const meRes = await axios.get(apiUrl("/api/auth/me"), { withCredentials: true });
    const me = meRes?.data || null;
    sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
    setUser(me);
    return me;
  }, []);

  const googleLogin = useCallback(async (idToken: string, rememberMe?: boolean) => {
    await axios.post(
      apiUrl("/api/auth/google"),
      { idToken, rememberMe: !!rememberMe },
      { withCredentials: true }
    );

    const meRes = await axios.get(apiUrl("/api/auth/me"), { withCredentials: true });
    const me = meRes?.data || null;
    sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    sessionStorage.setItem(MANUAL_LOGOUT_KEY, "1");
    setUser(null);
    try {
      await axios.post(apiUrl("/api/auth/logout"), {}, { withCredentials: true });
    } catch {
      // Keep local logout state even if server call fails.
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isAuthLoading,
      refreshSession,
      login,
      googleLogin,
      logout,
    }),
    [user, isAuthLoading, refreshSession, login, googleLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
