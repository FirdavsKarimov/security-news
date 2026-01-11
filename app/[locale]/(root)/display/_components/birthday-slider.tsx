"use client";

import Autoplay from "embla-carousel-autoplay";
import { Cake, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { fetchTodayBirthdays } from "@/service/api.service";

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
    birthDate: string;
    position?: string;
}

const BirthdaySlider = () => {
    const [birthdays, setBirthdays] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBirthdays = async () => {
            try {
                const data = await fetchTodayBirthdays();
                setBirthdays(data);
            } catch (error) {
                console.error("Failed to load birthdays:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBirthdays();
    }, []);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-pink-900/80 to-purple-900/80 rounded-2xl">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-pink-300 border-t-transparent" />
            </div>
        );
    }

    if (birthdays.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-900/80 to-purple-900/80 rounded-2xl">
                <Cake className="h-12 w-12 text-pink-300/50 mb-2" />
                <p className="text-pink-200/60 text-lg">Bugun tug'ilgan kun yo'q</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-gradient-to-br from-pink-900/90 to-purple-900/90 rounded-2xl overflow-hidden p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <PartyPopper className="h-6 w-6 text-pink-300 animate-bounce" />
                <h3 className="text-pink-100 text-xl font-bold">Tug'ilgan Kunlar</h3>
                <span className="text-2xl">🎂</span>
            </div>

            {/* Slider */}
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 3500,
                        stopOnInteraction: false,
                    }),
                ]}
                className="flex-1"
            >
                <CarouselContent className="h-full -ml-0">
                    {birthdays.map((employee) => (
                        <CarouselItem key={employee.id} className="h-full pl-0">
                            <div className="h-full flex flex-col items-center justify-center p-4">
                                {/* Photo */}
                                <div className="relative w-36 h-36 mb-4">
                                    <img
                                        src={employee.photo}
                                        alt={`${employee.firstName} ${employee.lastName}`}
                                        className="w-full h-full rounded-full object-cover border-4 border-pink-400/50"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/150x150?text=👤";
                                        }}
                                    />
                                    <div className="absolute -top-2 -right-2 text-4xl animate-bounce">🎉</div>
                                </div>

                                {/* Name */}
                                <h4 className="text-pink-100 text-2xl font-bold text-center">
                                    {employee.firstName} {employee.lastName}
                                </h4>

                                {/* Position */}
                                {employee.position && (
                                    <p className="text-pink-200/80 text-lg text-center mt-1">
                                        {employee.position}
                                    </p>
                                )}

                                {/* Congratulations */}
                                <p className="text-pink-300 text-xl font-medium mt-3 animate-pulse">
                                    🎊 Tug'ilgan kuningiz muborak! 🎊
                                </p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default BirthdaySlider;
