/**
 * Admin Service for Employees, Honorary Employees, and Events
 * CRUD operations connecting to dx.project2 backend
 */

import { getToken } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// ================================
// Auth Helper
// ================================

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();
    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
}

// ================================
// Employee Types & Functions
// ================================

export interface Employee {
    _id: string;
    firstName: string;
    lastName: string;
    photo: string;
    birthDate: string;
    position?: string;
    isActive: boolean;
    createdAt: string;
}

export interface EmployeeListResponse {
    success: boolean;
    count?: number;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
    data?: Employee[];
    error?: string;
}

export async function getEmployees(page = 1, limit = 20): Promise<EmployeeListResponse> {
    try {
        const response = await fetch(`${API_URL}/employees?page=${page}&limit=${limit}&active=false`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching employees:", error);
        return { success: false, error: "Failed to fetch employees" };
    }
}

export async function createEmployee(data: FormData): Promise<{ success: boolean; data?: Employee; error?: string }> {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/employees`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data,
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating employee:", error);
        return { success: false, error: "Failed to create employee" };
    }
}

export async function updateEmployee(id: string, data: FormData): Promise<{ success: boolean; data?: Employee; error?: string }> {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/employees/${id}`, {
            method: "PUT",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data,
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating employee:", error);
        return { success: false, error: "Failed to update employee" };
    }
}

export async function deleteEmployee(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await authFetch(`${API_URL}/employees/${id}`, { method: "DELETE" });
        return await response.json();
    } catch (error) {
        console.error("Error deleting employee:", error);
        return { success: false, error: "Failed to delete employee" };
    }
}

// ================================
// Honorary Employee Types & Functions
// ================================

export interface HonoraryEmployee {
    _id: string;
    firstName: string;
    lastName: string;
    photo: string;
    position?: string;
    startDate: string;
    endDate: string;
    workPeriod?: string;
    isActive: boolean;
    createdAt: string;
}

export interface HonoraryEmployeeListResponse {
    success: boolean;
    count?: number;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
    data?: HonoraryEmployee[];
    error?: string;
}

export async function getHonoraryEmployees(page = 1, limit = 20): Promise<HonoraryEmployeeListResponse> {
    try {
        const response = await fetch(`${API_URL}/honorary-employees?page=${page}&limit=${limit}&active=false`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching honorary employees:", error);
        return { success: false, error: "Failed to fetch honorary employees" };
    }
}

export async function createHonoraryEmployee(data: FormData): Promise<{ success: boolean; data?: HonoraryEmployee; error?: string }> {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/honorary-employees`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data,
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating honorary employee:", error);
        return { success: false, error: "Failed to create honorary employee" };
    }
}

export async function updateHonoraryEmployee(id: string, data: FormData): Promise<{ success: boolean; data?: HonoraryEmployee; error?: string }> {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/honorary-employees/${id}`, {
            method: "PUT",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data,
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating honorary employee:", error);
        return { success: false, error: "Failed to update honorary employee" };
    }
}

export async function deleteHonoraryEmployee(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await authFetch(`${API_URL}/honorary-employees/${id}`, { method: "DELETE" });
        return await response.json();
    } catch (error) {
        console.error("Error deleting honorary employee:", error);
        return { success: false, error: "Failed to delete honorary employee" };
    }
}

// ================================
// Event Types & Functions
// ================================

export interface Event {
    _id: string;
    title: string;
    description?: string;
    photos: string[];
    eventDate: string;
    isActive: boolean;
    createdAt: string;
}

export interface EventListResponse {
    success: boolean;
    count?: number;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
    data?: Event[];
    error?: string;
}

export async function getEvents(page = 1, limit = 20): Promise<EventListResponse> {
    try {
        const response = await fetch(`${API_URL}/events?page=${page}&limit=${limit}&active=false`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching events:", error);
        return { success: false, error: "Failed to fetch events" };
    }
}

export async function createEvent(data: FormData): Promise<{ success: boolean; data?: Event; error?: string }> {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/events`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data,
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: "Failed to create event" };
    }
}

export async function updateEvent(id: string, data: FormData): Promise<{ success: boolean; data?: Event; error?: string }> {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: "PUT",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data,
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, error: "Failed to update event" };
    }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await authFetch(`${API_URL}/events/${id}`, { method: "DELETE" });
        return await response.json();
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: "Failed to delete event" };
    }
}

// ================================
// Dashboard Stats
// ================================

export async function getFullDashboardStats(): Promise<{
    newsCount: number;
    categoryCount: number;
    employeeCount: number;
    honoraryEmployeeCount: number;
    eventCount: number;
}> {
    try {
        const [newsRes, catRes, empRes, honRes, evtRes] = await Promise.all([
            fetch(`${API_URL}/news?limit=1`),
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}/employees?limit=1`),
            fetch(`${API_URL}/honorary-employees?limit=1`),
            fetch(`${API_URL}/events?limit=1`),
        ]);

        const [newsData, catData, empData, honData, evtData] = await Promise.all([
            newsRes.json(),
            catRes.json(),
            empRes.json(),
            honRes.json(),
            evtRes.json(),
        ]);

        return {
            newsCount: newsData.total || newsData.pagination?.totalItems || 0,
            categoryCount: catData.data?.length || 0,
            employeeCount: empData.pagination?.totalItems || 0,
            honoraryEmployeeCount: honData.pagination?.totalItems || 0,
            eventCount: evtData.pagination?.totalItems || 0,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { newsCount: 0, categoryCount: 0, employeeCount: 0, honoraryEmployeeCount: 0, eventCount: 0 };
    }
}
