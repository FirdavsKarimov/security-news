"use client";

import Autoplay from "embla-carousel-autoplay";
import { Calendar, Images } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { fetchEvents } from "@/service/api.service";

interface Event {
    id: string;
    title: string;
    photos: string[];
    description?: string;
    eventDate: string;
}

const EventsSlider = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to load events:", error);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                <Calendar className="h-10 w-10 text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">Tadbirlar mavjud emas</p>
            </div>
        );
    }

    // Flatten events to show individual photos
    const allPhotos = events.slice(0, 10).flatMap((event) =>
        event.photos.slice(0, 3).map((photo) => ({
            photo,
            title: event.title,
            eventDate: event.eventDate,
            photoCount: event.photos.length,
        }))
    );

    return (
        <div className="h-full w-full bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border-b border-slate-600">
                <Calendar className="h-5 w-5 text-blue-400" />
                <h3 className="text-slate-100 text-base font-semibold uppercase tracking-wide">Tadbirlar</h3>
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
                            delay: 4000,
                            stopOnInteraction: false,
                        }),
                    ]}
                    className="absolute inset-0"
                >
                    <div className="h-full w-full [&>div]:h-full">
                        <CarouselContent className="h-full -ml-0">
                            {allPhotos.map((item, index) => (
                                <CarouselItem key={`${item.title}-${index}`} className="h-full pl-0">
                                    <div className="relative h-full w-full">
                                        {/* Photo */}
                                        <img
                                            src={item.photo}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";
                                            }}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                                        {/* Photo count badge */}
                                        {item.photoCount > 1 && (
                                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 text-slate-200 px-2 py-1 text-xs font-medium">
                                                <Images className="h-3 w-3" />
                                                <span>{item.photoCount}</span>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h4 className="text-white text-lg font-medium line-clamp-2 leading-snug">
                                                {item.title}
                                            </h4>
                                            <p className="text-slate-300 text-sm mt-1">
                                                {formatDate(item.eventDate)}
                                            </p>
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

export default EventsSlider;
