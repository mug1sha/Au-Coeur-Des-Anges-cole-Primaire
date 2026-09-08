/**
 * Authentication service abstraction.
 *
 * This module provides a clean interface for authentication operations.
 * Replace the mock implementations with real API calls when a backend
 * is connected.
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "parent";
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

/**
 * Simulate a login request.
 * TODO: Replace with real API call (e.g. fetch('/api/auth/login', ...))
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Mock delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock: always succeed for demo purposes
  // In production, this would call a real authentication endpoint
  if (credentials.email && credentials.password) {
    return {
      success: true,
      user: {
        id: "1",
        email: credentials.email,
        name: "Utilisateur",
        role: "parent",
      },
      token: "mock-jwt-token",
    };
  }

  return {
    success: false,
    error: "Identifiants incorrects.",
  };
}

/**
 * Simulate a logout request.
 * TODO: Replace with real API call
 */
export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Clear any stored tokens/session data
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }
}

/**
 * Check if a user is currently authenticated.
 * TODO: Replace with real session/token validation
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth_token") || !!sessionStorage.getItem("auth_token");
}

/**
 * Get the current user from storage.
 * TODO: Replace with real user fetch from API or context
 */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Store auth data after successful login.
 */
export function storeAuthData(user: AuthUser, token: string, remember: boolean): void {
  if (typeof window === "undefined") return;
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("auth_token", token);
  storage.setItem("auth_user", JSON.stringify(user));
}
