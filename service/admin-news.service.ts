/**
 * Admin News Service
 * CRUD operations for news management (admin only)
 */

import { authFetch, getToken } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    content: string;
    summary?: string;
    image: string;
    categories: Array<{ id: string; name: string }>;
    category?: { _id: string; name: string; slug: string };
    author?: string;
    tags?: string[];
    isPublished: boolean;
    isActive: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface NewsListResponse {
    success: boolean;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data?: NewsItem[];
    error?: string;
}

export interface NewsSingleResponse {
    success: boolean;
    data?: NewsItem;
    error?: string;
}

export interface CategoryItem {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
}

export interface CategoryListResponse {
    success: boolean;
    data?: CategoryItem[];
    error?: string;
}

/**
 * Get all news (admin view - includes unpublished)
 */
export async function getAdminNews(
    page: number = 1,
    limit: number = 10
): Promise<NewsListResponse> {
    try {
        const response = await authFetch(
            `${API_URL}/news?page=${page}&limit=${limit}`
        );
        return await response.json();
    } catch (error) {
        console.error("Error fetching admin news:", error);
        return { success: false, error: "Failed to fetch news" };
    }
}

/**
 * Get single news item
 */
export async function getNewsById(id: string): Promise<NewsSingleResponse> {
    try {
        const response = await fetch(`${API_URL}/news/${id}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching news:", error);
        return { success: false, error: "Failed to fetch news" };
    }
}

/**
 * Create new news item
 */
export async function createNews(newsData: {
    title: string;
    content: string;
    summary?: string;
    categories?: string[];
    category?: string;
    author?: string;
    tags?: string[];
    isPublished?: boolean;
    image: string;
}): Promise<NewsSingleResponse> {
    try {
        const response = await authFetch(`${API_URL}/news`, {
            method: "POST",
            body: JSON.stringify(newsData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating news:", error);
        return { success: false, error: "Failed to create news" };
    }
}

/**
 * Update news item
 */
export async function updateNews(
    id: string,
    newsData: Partial<{
        title: string;
        content: string;
        summary?: string;
        categories?: string[];
        category?: string;
        author?: string;
        tags?: string[];
        isPublished?: boolean;
        image?: string;
    }>
): Promise<NewsSingleResponse> {
    try {
        const response = await authFetch(`${API_URL}/news/${id}`, {
            method: "PUT",
            body: JSON.stringify(newsData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating news:", error);
        return { success: false, error: "Failed to update news" };
    }
}

/**
 * Delete news item
 */
export async function deleteNews(
    id: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await authFetch(`${API_URL}/news/${id}`, {
            method: "DELETE",
        });
        return await response.json();
    } catch (error) {
        console.error("Error deleting news:", error);
        return { success: false, error: "Failed to delete news" };
    }
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
    file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
    const token = getToken();

    if (!token) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${API_URL}/news/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (data.success && data.data) {
            // Return full URL with backend base path
            const baseUrl = API_URL.replace('/api', '');
            const imageUrl = data.data.url.startsWith('http')
                ? data.data.url
                : `${baseUrl}${data.data.url}`;
            return { success: true, url: imageUrl };
        }

        return { success: false, error: data.error || "Upload failed" };
    } catch (error) {
        console.error("Error uploading image:", error);
        return { success: false, error: "Failed to upload image" };
    }
}

/**
 * Get all categories
 */
export async function getAdminCategories(): Promise<CategoryListResponse> {
    try {
        const response = await fetch(`${API_URL}/categories`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: "Failed to fetch categories" };
    }
}

/**
 * Create category
 */
export async function createCategory(categoryData: {
    name: string;
    description?: string;
}): Promise<{ success: boolean; data?: CategoryItem; error?: string }> {
    try {
        const response = await authFetch(`${API_URL}/categories`, {
            method: "POST",
            body: JSON.stringify(categoryData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats(): Promise<{
    newsCount: number;
    categoryCount: number;
}> {
    try {
        const [newsRes, catRes] = await Promise.all([
            fetch(`${API_URL}/news?limit=1`),
            fetch(`${API_URL}/categories`),
        ]);

        const newsData = await newsRes.json();
        const catData = await catRes.json();

        return {
            newsCount: newsData.pagination?.total || 0,
            categoryCount: catData.data?.length || 0,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { newsCount: 0, categoryCount: 0 };
    }
}
