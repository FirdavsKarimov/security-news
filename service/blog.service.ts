/**
 * Blog Service - Fetches news/blog data from backend API
 * Updated to use REST API instead of GraphQL
 */

import { INews } from "@/types/service-type";
import { fetchNews, fetchNewsBySlug } from "./api.service";

/**
 * Get all published blogs/news
 */
export const getBlogs = async (): Promise<INews[]> => {
  const news = await fetchNews({ published: true, limit: 100 });
  return news;
};

/**
 * Get single blog/news by slug
 */
export const getBlog = async (slug: string): Promise<INews | null> => {
  return await fetchNewsBySlug(slug);
};
