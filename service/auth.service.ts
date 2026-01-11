/**
 * Admin Authentication Service
 * Handles admin login, logout, and token management
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export interface AdminUser {
    _id: string;
    username: string;
    email: string;
    role: "superadmin" | "admin" | "moderator";
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    data?: {
        admin: AdminUser;
        token: string;
    };
    error?: string;
}

export interface ProfileResponse {
    success: boolean;
    data?: AdminUser;
    error?: string;
}

const TOKEN_KEY = "admin_token";
const ADMIN_KEY = "admin_user";

/**
 * Store auth data in localStorage
 */
function storeAuthData(token: string, admin: AdminUser): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    }
}

/**
 * Clear auth data from localStorage
 */
function clearAuthData(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_KEY);
    }
}

/**
 * Get stored token
 */
export function getToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
}

/**
 * Get stored admin user
 */
export function getStoredAdmin(): AdminUser | null {
    if (typeof window !== "undefined") {
        const adminStr = localStorage.getItem(ADMIN_KEY);
        if (adminStr) {
            try {
                return JSON.parse(adminStr);
            } catch {
                return null;
            }
        }
    }
    return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * Admin login
 */
export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data: LoginResponse = await response.json();

        if (data.success && data.data) {
            storeAuthData(data.data.token, data.data.admin);
        }

        return data;
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: "Network error. Please try again.",
        };
    }
}

/**
 * Admin logout
 */
export function logout(): void {
    clearAuthData();
}

/**
 * Get admin profile (requires authentication)
 */
export async function getProfile(): Promise<ProfileResponse> {
    const token = getToken();

    if (!token) {
        return {
            success: false,
            error: "Not authenticated",
        };
    }

    try {
        const response = await fetch(`${API_URL}/admin/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data: ProfileResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Profile fetch error:", error);
        return {
            success: false,
            error: "Network error. Please try again.",
        };
    }
}

/**
 * Check initialization status (if any admin exists)
 */
export async function checkInitializationStatus(): Promise<{
    isInitialized: boolean;
    adminCount: number;
}> {
    try {
        const response = await fetch(`${API_URL}/admin/check-initialization-status`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        }
        return { isInitialized: false, adminCount: 0 };
    } catch (error) {
        console.error("Initialization check error:", error);
        return { isInitialized: false, adminCount: 0 };
    }
}

/**
 * Initialize first admin (only works when no admins exist)
 */
export async function initializeFirstAdmin(
    username: string,
    email: string,
    password: string,
    role: "superadmin" | "admin" | "moderator" = "admin"
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(
            `${API_URL}/admin/initialize-first-admin-user-setup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password, role }),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Initialize admin error:", error);
        return {
            success: false,
            error: "Network error. Please try again.",
        };
    }
}

/**
 * Make authenticated API request
 */
export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = getToken();

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
        ...options,
        headers,
    });
}
