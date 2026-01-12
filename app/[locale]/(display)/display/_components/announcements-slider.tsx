"use client";

import Autoplay from "embla-carousel-autoplay";
import { Megaphone } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { fetchAnnouncements } from "@/service/api.service";

interface Announcement {
    id: string;
    title: string;
    content?: string;
    createdAt: string;
}

const AnnouncementsSlider = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnnouncements = async () => {
            try {
                const data = await fetchAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to load announcements:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAnnouncements();
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

    if (announcements.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                <Megaphone className="h-10 w-10 text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">E&apos;lonlar mavjud emas</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-indigo-800/80 border-b border-indigo-700">
                <Megaphone className="h-5 w-5 text-indigo-300" />
                <h3 className="text-indigo-50 text-base font-semibold uppercase tracking-wide">E&apos;lonlar</h3>
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
                            {announcements.map((item) => (
                                <CarouselItem key={item.id} className="h-full pl-0">
                                    <div className="h-full flex flex-col justify-center p-6 bg-slate-800">
                                        {/* Date */}
                                        <div className="text-indigo-400 text-sm mb-2">
                                            {formatDate(item.createdAt)}
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-slate-100 text-xl font-semibold leading-snug mb-3">
                                            {item.title}
                                        </h4>

                                        {/* Content */}
                                        {item.content && (
                                            <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed">
                                                {item.content}
                                            </p>
                                        )}
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

export default AnnouncementsSlider;
