"use client";

import Autoplay from "embla-carousel-autoplay";
import { Newspaper } from "lucide-react";
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

const MiniNewsSlider = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await fetchNews({ limit: 8, published: true });
                setNews(data);
            } catch (error) {
                console.error("Failed to load news:", error);
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "short",
        });
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                <Newspaper className="h-10 w-10 text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">Yangiliklar mavjud emas</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border-b border-slate-600">
                <Newspaper className="h-5 w-5 text-blue-400" />
                <h3 className="text-slate-100 text-base font-semibold uppercase tracking-wide">So'nggi Yangiliklar</h3>
            </div>

            {/* Slider */}
            <div className="flex-1 relative">
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
                    className="absolute inset-0"
                >
                    <div className="h-full w-full [&>div]:h-full">
                        <CarouselContent className="h-full -ml-0">
                            {news.map((item) => (
                                <CarouselItem key={item.id} className="h-full pl-0">
                                    <div className="relative h-full w-full">
                                        {/* Photo */}
                                        <img
                                            src={item.image?.url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"}
                                            alt={item.titleKr}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";
                                            }}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                                        {/* Date badge */}
                                        <div className="absolute top-3 right-3 bg-blue-700 text-white px-2 py-1 text-xs font-medium">
                                            {formatDate(item.createdAt)}
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h4 className="text-white text-lg font-medium line-clamp-3 leading-snug">
                                                {item.titleKr}
                                            </h4>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </div>
                </Carousel>
            </div>
        </div>
    );
};

export default MiniNewsSlider;
