"use client";

import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { fetchNews } from "@/service/api.service";

interface News {
    id: string;
    titleKr: string;
    slug: string;
    image: {
        url: string;
    };
    createdAt: string;
}

const MainNewsSlider = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await fetchNews({ limit: 10, published: true });
                setNews(data);
            } catch (error) {
                console.error("Failed to load news:", error);
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, []);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-900">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-400 border-t-transparent" />
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-900">
                <p className="text-slate-400 text-xl">Yangiliklar mavjud emas</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative bg-slate-900">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 6000,
                        stopOnInteraction: false,
                    }),
                ]}
                className="absolute inset-0"
            >
                <div className="h-full w-full [&>div]:h-full">
                    <CarouselContent className="h-full -ml-0">
                        {news.map((item) => (
                            <CarouselItem key={item.id} className="h-full pl-0">
                                <div className="relative h-full w-full">
                                    {/* Background Image */}
                                    <img
                                        src={item.image?.url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80"}
                                        alt={item.titleKr}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80";
                                        }}
                                    />

                                    {/* Dark Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

                                    {/* Content */}
                                    <div className="absolute bottom-8 left-0 right-0 px-8">
                                        {/* Category Badge */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="bg-blue-700 text-white px-4 py-1.5 text-base font-medium uppercase tracking-wide">
                                                Yangilik
                                            </span>
                                            <span className="text-slate-300 text-base">
                                                {new Date(item.createdAt).toLocaleDateString("uz-UZ", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-white text-4xl font-semibold leading-tight line-clamp-3">
                                            {item.titleKr}
                                        </h2>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </div>
            </Carousel>
        </div>
    );
};

export default MainNewsSlider;
