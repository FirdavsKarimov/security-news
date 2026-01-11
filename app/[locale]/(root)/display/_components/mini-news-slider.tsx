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
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-emerald-900/80 to-teal-900/80 rounded-2xl">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-300 border-t-transparent" />
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/80 to-teal-900/80 rounded-2xl">
                <Newspaper className="h-12 w-12 text-emerald-300/50 mb-2" />
                <p className="text-emerald-200/60 text-lg">Yangiliklar yo'q</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-gradient-to-br from-emerald-900/90 to-teal-900/90 rounded-2xl overflow-hidden p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Newspaper className="h-6 w-6 text-emerald-300" />
                <h3 className="text-emerald-100 text-xl font-bold">So'nggi Yangiliklar</h3>
            </div>

            {/* Slider */}
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 4500,
                        stopOnInteraction: false,
                    }),
                ]}
                className="flex-1"
            >
                <CarouselContent className="h-full -ml-0">
                    {news.map((item) => (
                        <CarouselItem key={item.id} className="h-full pl-0">
                            <div className="relative h-full w-full">
                                {/* Photo */}
                                <img
                                    src={item.image?.url || "https://via.placeholder.com/600x400?text=News"}
                                    alt={item.titleKr}
                                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://via.placeholder.com/600x400?text=News";
                                    }}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-xl" />

                                {/* Date badge */}
                                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {formatDate(item.createdAt)}
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h4 className="text-white text-xl font-bold line-clamp-3">
                                        {item.titleKr}
                                    </h4>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default MiniNewsSlider;
