/**
 * Category Service - Fetches category data from backend API
 * Updated to use REST API instead of GraphQL
 */

import { cache } from "react";

import { ICategorie, ICategorieNews } from "@/types/service-type";
import { fetchCategories, fetchCategoryWithNews } from "./api.service";

/**
 * Get all active categories
 */
export const getCategories = async (): Promise<ICategorie[]> => {
  return await fetchCategories();
};

/**
 * Get category with its news by slug
 * Cached with React cache for deduplication
 */
export const getCategorieNews = cache(
  async (slug: string): Promise<ICategorieNews | null> => {
    return await fetchCategoryWithNews(slug);
  }
);
