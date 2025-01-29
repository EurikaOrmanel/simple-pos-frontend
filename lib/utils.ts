import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuthState {
  isAuthenticated: boolean;
  user?: {
    role: string;
  };
  token?: string;
}

export function getAuthToken(): string | null {
  const authData = Cookies.get("auth-storage");

  if (!authData) return null;

  try {
    const parsedData = JSON.parse(decodeURIComponent(authData));
    return parsedData.state?.token || null;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
}

export function getAuthState(): AuthState | null {
  const authData = Cookies.get("auth-storage");

  if (!authData) return null;

  try {
    const parsedData = JSON.parse(decodeURIComponent(authData));
    return parsedData.state || null;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
}
