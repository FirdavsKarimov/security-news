/**
 * REST API Service for connecting to the backend
 * Transforms backend responses to match frontend interfaces
 */

import { INews, ICategorie, ICategorieNews } from "@/types/service-type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Backend response interfaces
interface BackendNews {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  image: string;
  images?: string[];
  categories: {
    id: string;
    name: string;
  }[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  author?: string;
  slug: string;
  tags?: string[];
  isPublished: boolean;
  isActive: boolean;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendCategory {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  error?: string;
}

/**
 * Transform backend news to frontend INews format
 * Both titleKr (Cyrillic) and titleUz (Latin) use the same backend title
 */
function transformNewsToFrontend(news: BackendNews): INews {
  // Placeholder image for news without images
  const placeholderImage =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";

  return {
    id: news._id,
    titleKr: news.title, // Cyrillic - same as backend title for now
    titleUz: news.title, // Latin - same as backend title for now
    slug: news.slug,
    descriptionKr: {
      html: news.content,
    },
    descriptionUz: {
      html: news.content,
    },
    image: {
      url: news.image || placeholderImage,
    },
    categories: news.categories?.length
      ? news.categories.map((cat) => ({
        slug: cat.id,
        title: cat.name,
      }))
      : news.category
        ? [{ slug: news.category.slug, title: news.category.name }]
        : [],
    createdAt: news.createdAt,
  };
}

/**
 * Transform backend category to frontend ICategorie format
 */
function transformCategoryToFrontend(
  category: BackendCategory,
  newsCount: number = 0
): ICategorie {
  return {
    id: category._id,
    slug: category.slug,
    title: category.name,
    news: Array(newsCount).fill({ id: "" }), // Placeholder for count
  };
}

/**
 * Fetch all news from backend
 */
export async function fetchNews(options?: {
  page?: number;
  limit?: number;
  published?: boolean;
  search?: string;
  category?: string;
}): Promise<INews[]> {
  const params = new URLSearchParams();

  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.published !== undefined)
    params.append("published", options.published.toString());
  if (options?.search) params.append("search", options.search);
  if (options?.category) params.append("category", options.category);

  const url = `${API_URL}/news${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await fetch(url, {
    cache: "no-store", // Disable cache for fresh data
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  const result: BackendResponse<BackendNews[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch news");
  }

  return result.data.map(transformNewsToFrontend);
}

/**
 * Fetch single news by ID
 */
export async function fetchNewsById(id: string): Promise<INews | null> {
  const response = await fetch(`${API_URL}/news/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  const result: BackendResponse<BackendNews> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch news");
  }

  return transformNewsToFrontend(result.data);
}

/**
 * Fetch single news by slug
 * Note: Backend uses ID, so we need to fetch all and find by slug
 * TODO: Add slug endpoint to backend for better performance
 */
export async function fetchNewsBySlug(slug: string): Promise<INews | null> {
  // First try to fetch all news and find by slug
  const allNews = await fetchNews({ limit: 100 });
  return allNews.find((news) => news.slug === slug) || null;
}

/**
 * Fetch all categories from backend
 */
export async function fetchCategories(): Promise<ICategorie[]> {
  const response = await fetch(`${API_URL}/categories?active=true`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const result: BackendResponse<BackendCategory[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch categories");
  }

  return result.data.map((cat) => transformCategoryToFrontend(cat));
}

/**
 * Fetch category with its news
 */
export async function fetchCategoryWithNews(
  slug: string
): Promise<ICategorieNews | null> {
  // First fetch all categories to find the one with matching slug
  const categoriesResponse = await fetch(`${API_URL}/categories?active=true`, {
    cache: "no-store",
  });

  if (!categoriesResponse.ok) {
    throw new Error(
      `Failed to fetch categories: ${categoriesResponse.statusText}`
    );
  }

  const categoriesResult: BackendResponse<BackendCategory[]> =
    await categoriesResponse.json();

  if (!categoriesResult.success) {
    throw new Error(categoriesResult.error || "Failed to fetch categories");
  }

  const category = categoriesResult.data.find((cat) => cat.slug === slug);
  if (!category) return null;

  // Fetch news for this category
  const newsResponse = await fetch(
    `${API_URL}/news/category/${category._id}?limit=100`,
    {
      cache: "no-store",
    }
  );

  if (!newsResponse.ok) {
    throw new Error(`Failed to fetch news: ${newsResponse.statusText}`);
  }

  const newsResult: BackendResponse<BackendNews[]> = await newsResponse.json();

  return {
    id: category._id,
    title: category.name,
    slug: category.slug,
    news: newsResult.success ? newsResult.data.map(transformNewsToFrontend) : [],
  };
}

/**
 * Health check for backend API
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    const result = await response.json();
    return result.status === "OK";
  } catch {
    return false;
  }
}

// ===========================================
// Employee API Functions
// ===========================================

interface BackendEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  photo: string;
  birthDate: string;
  position?: string;
  isActive: boolean;
}

interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  birthDate: string;
  position?: string;
  isActive: boolean;
}

function transformEmployeeToFrontend(employee: BackendEmployee): IEmployee {
  return {
    id: employee._id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    photo: employee.photo.startsWith('http') ? employee.photo : `${API_URL.replace('/api', '')}${employee.photo}`,
    birthDate: employee.birthDate,
    position: employee.position,
    isActive: employee.isActive,
  };
}

/**
 * Fetch all employees
 */
export async function fetchEmployees(): Promise<IEmployee[]> {
  const response = await fetch(`${API_URL}/employees`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.statusText}`);
  }

  const result: BackendResponse<BackendEmployee[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch employees");
  }

  return result.data.map(transformEmployeeToFrontend);
}

/**
 * Fetch today's birthdays
 */
export async function fetchTodayBirthdays(): Promise<IEmployee[]> {
  const response = await fetch(`${API_URL}/employees/today-birthdays`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch today birthdays: ${response.statusText}`);
  }

  const result: BackendResponse<BackendEmployee[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch today birthdays");
  }

  return result.data.map(transformEmployeeToFrontend);
}

// ===========================================
// Honorary Employee API Functions
// ===========================================

interface BackendHonoraryEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  photo: string;
  position?: string;
  startDate: string;
  endDate: string;
  workPeriod?: string;
  isActive: boolean;
}

interface IHonoraryEmployee {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  position?: string;
  startDate: string;
  endDate: string;
  workPeriod?: string;
  isActive: boolean;
}

function transformHonoraryEmployeeToFrontend(employee: BackendHonoraryEmployee): IHonoraryEmployee {
  return {
    id: employee._id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    photo: employee.photo.startsWith('http') ? employee.photo : `${API_URL.replace('/api', '')}${employee.photo}`,
    position: employee.position,
    startDate: employee.startDate,
    endDate: employee.endDate,
    workPeriod: employee.workPeriod,
    isActive: employee.isActive,
  };
}

/**
 * Fetch all honorary employees
 */
export async function fetchHonoraryEmployees(): Promise<IHonoraryEmployee[]> {
  const response = await fetch(`${API_URL}/honorary-employees`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch honorary employees: ${response.statusText}`);
  }

  const result: BackendResponse<BackendHonoraryEmployee[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch honorary employees");
  }

  return result.data.map(transformHonoraryEmployeeToFrontend);
}

// ===========================================
// Event API Functions
// ===========================================

interface BackendEvent {
  _id: string;
  title: string;
  photos: string[];
  description?: string;
  eventDate: string;
  isActive: boolean;
}

interface IEvent {
  id: string;
  title: string;
  photos: string[];
  description?: string;
  eventDate: string;
  isActive: boolean;
}

function transformEventToFrontend(event: BackendEvent): IEvent {
  return {
    id: event._id,
    title: event.title,
    photos: event.photos.map(photo =>
      photo.startsWith('http') ? photo : `${API_URL.replace('/api', '')}${photo}`
    ),
    description: event.description,
    eventDate: event.eventDate,
    isActive: event.isActive,
  };
}

/**
 * Fetch all events
 */
export async function fetchEvents(): Promise<IEvent[]> {
  const response = await fetch(`${API_URL}/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  const result: BackendResponse<BackendEvent[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch events");
  }

  return result.data.map(transformEventToFrontend);
}
