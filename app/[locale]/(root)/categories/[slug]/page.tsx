"use client";

import { Dot, Home, Layers } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import NewsCard from "@/components/cards/news-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategorieNews } from "@/service/categorie.service";
import { ICategorieNews } from "@/types/service-type";

interface Props {
  params: Promise<{ slug: string }>;
}

const CategoriesPage = ({ params }: Props) => {
  const { slug } = use(params);
  const [categorie, setCategorie] = useState<ICategorieNews | null>(null);
  const [loading, setLoading] = useState(true);

  // Client-side fetch
  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const data = await getCategorieNews(slug);
        setCategorie(data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorie();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-xl">
        Yuklanmoqda...
      </div>
    );
  }

  if (!categorie) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-xl">
        Kategoriya topilmadi 😕
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="relative flex min-h-[30vh] flex-col items-center justify-center">
        <h2 className="section-title font-creteRound text-center text-4xl">
          <span>{categorie.title}</span>
        </h2>

        <div className="mt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1">
                    <Home className="size-4" /> Bosh sahifa
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>
                <Dot className="size-5" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/categories" className="flex items-center gap-1">
                    <Layers className="size-4" /> Kategoriyalar
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>
                <Dot className="size-5" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbPage>{categorie.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* News list */}
      <div className="mt-24 grid grid-cols-2 gap-x-4 gap-y-24 max-md:grid-cols-1 max-md:p-2">
        {categorie.news.map((newsItem, index) => (
          <NewsCard key={newsItem.id} post={newsItem} index={index} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
