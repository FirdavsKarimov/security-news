"use client";

import Autoplay from "embla-carousel-autoplay";
import { CalendarDays, Images, Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { TextAnimate } from "@/components/ui/text-animate";
import { fetchEvents } from "@/service/api.service";

interface Event {
    id: string;
    title: string;
    photos: string[];
    description?: string;
    eventDate: string;
}

const EventsGallerySlider = () => {
    const t = useTranslations();
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

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="py-12">
                <div className="container mx-auto max-w-7xl px-2">
                    <div className="flex items-center gap-3 mb-8">
                        <Newspaper className="h-8 w-8 text-blue-600" />
                        <h2 className="text-3xl font-bold">{t("events.title")}</h2>
                    </div>
                    <div className="flex items-center justify-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="container mx-auto max-w-7xl px-2">
                    <div className="flex items-center gap-3 mb-8">
                        <Newspaper className="h-8 w-8 text-blue-600" />
                        <h2 className="font-spaceGrotesk border-primary/70 border-b-2 pb-1 text-3xl font-bold">
                            <TextAnimate animation="slideLeft" by="character">
                                {t("events.title")}
                            </TextAnimate>
                        </h2>
                    </div>
                    <div className="text-center py-12 text-muted-foreground">
                        <Newspaper className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p>Hozircha tadbirlar yo&apos;q</p>
                    </div>
                </div>
            </div>
        );
    }

    // Flatten all photos from all events for a continuous gallery
    const allPhotos = events.flatMap((event) =>
        event.photos.map((photo) => ({
            photo,
            title: event.title,
            eventDate: event.eventDate,
            description: event.description,
        }))
    );

    return (
        <div className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="container mx-auto max-w-7xl px-2">
                <div className="flex items-center gap-3 mb-8">
                    <Newspaper className="h-8 w-8 text-blue-600" />
                    <h2 className="font-spaceGrotesk border-primary/70 border-b-2 pb-1 text-3xl font-bold">
                        <TextAnimate animation="slideLeft" by="character">
                            {t("events.title")}
                        </TextAnimate>
                    </h2>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 3500,
                            stopOnInteraction: false,
                            stopOnMouseEnter: true,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {allPhotos.map((item, index) => (
                            <CarouselItem
                                key={`${item.title}-${index}`}
                                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-1">
                                    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all group">
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={item.photo}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=📷";
                                                }}
                                            />

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Title overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="font-bold text-lg text-white mb-1 line-clamp-2">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                                    <CalendarDays className="h-4 w-4" />
                                                    <span>{formatDate(item.eventDate)}</span>
                                                </div>
                                            </div>

                                            {/* Photo count badge if multiple photos */}
                                            {(() => {
                                                const eventPhotos = events.find((e) => e.title === item.title)?.photos;
                                                return eventPhotos && eventPhotos.length > 1 && (
                                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                                        <Images className="h-3 w-3" />
                                                        <span>{eventPhotos.length}</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <div className="p-4">
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 -translate-x-1/2" />
                    <CarouselNext className="right-0 translate-x-1/2" />
                </Carousel>
            </div>
        </div>
    );
};

export default EventsGallerySlider;
