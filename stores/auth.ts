import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  role: "admin" | "pos";
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, role: "admin" | "pos") => void;
  logout: () => void;
}

// Custom storage object that uses cookies
const cookieStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = Cookies.get(name);
    return value ? value : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    Cookies.set(name, value, {
      expires: 30, // 30 days
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  },
  removeItem: async (name: string): Promise<void> => {
    Cookies.remove(name, { path: "/" });
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token: string, role: "admin" | "pos") =>
        set({
          token,
          isAuthenticated: true,
          user: {
            id: "placeholder",
            email: "placeholder",
            name: "placeholder",
            role,
          },
        }),
      logout: () => {
        Cookies.remove("auth-storage", { path: "/" });
        return set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
      skipHydration: true,
    }
  )
);
