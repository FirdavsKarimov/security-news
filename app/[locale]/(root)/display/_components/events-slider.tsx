"use client";

import Autoplay from "embla-carousel-autoplay";
import { CalendarDays, Images } from "lucide-react";
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
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-900/80 to-indigo-900/80 rounded-2xl">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-300 border-t-transparent" />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/80 to-indigo-900/80 rounded-2xl">
                <CalendarDays className="h-12 w-12 text-blue-300/50 mb-2" />
                <p className="text-blue-200/60 text-lg">Tadbirlar yo'q</p>
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
        <div className="h-full w-full bg-gradient-to-br from-blue-900/90 to-indigo-900/90 rounded-2xl overflow-hidden p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-6 w-6 text-blue-300" />
                <h3 className="text-blue-100 text-xl font-bold">Ishxona Tadbirlari</h3>
            </div>

            {/* Slider */}
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                    }),
                ]}
                className="flex-1"
            >
                <CarouselContent className="h-full -ml-0">
                    {allPhotos.map((item, index) => (
                        <CarouselItem key={`${item.title}-${index}`} className="h-full pl-0">
                            <div className="relative h-full w-full">
                                {/* Photo */}
                                <img
                                    src={item.photo}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://via.placeholder.com/600x400?text=📷";
                                    }}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-xl" />

                                {/* Photo count badge */}
                                {item.photoCount > 1 && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-sm">
                                        <Images className="h-3 w-3" />
                                        <span>{item.photoCount}</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h4 className="text-white text-xl font-bold line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-blue-200 text-sm mt-1">
                                        {formatDate(item.eventDate)}
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default EventsSlider;
