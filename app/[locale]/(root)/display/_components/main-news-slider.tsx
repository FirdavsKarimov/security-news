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
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <p className="text-white/60 text-2xl">Yangiliklar yo'q</p>
            </div>
        );
    }

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: false,
                }),
            ]}
            className="h-full w-full"
        >
            <CarouselContent className="h-full -ml-0">
                {news.map((item) => (
                    <CarouselItem key={item.id} className="h-full pl-0">
                        <div className="relative h-full w-full">
                            {/* Background Image */}
                            <img
                                src={item.image?.url || "https://via.placeholder.com/1920x1080?text=News"}
                                alt={item.titleKr}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/1920x1080?text=News";
                                }}
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h2 className="text-white text-4xl font-bold leading-tight line-clamp-3 drop-shadow-lg">
                                    {item.titleKr}
                                </h2>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-lg font-medium">
                                        Yangilik
                                    </span>
                                    <span className="text-white/80 text-lg">
                                        {new Date(item.createdAt).toLocaleDateString("uz-UZ", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};

export default MainNewsSlider;
