"use client";

import Autoplay from "embla-carousel-autoplay";
import { User } from "lucide-react";
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
            <div className="h-full w-full flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            </div>
        );
    }

    if (birthdays.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                <User className="h-10 w-10 text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">Bugun tug&apos;ilgan kun yo&apos;q</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-green-800/80 border-b border-green-700">
                <User className="h-5 w-5 text-green-300" />
                <h3 className="text-green-50 text-base font-semibold uppercase tracking-wide">Tug&apos;ilgan Kunlar</h3>
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
                            {birthdays.map((employee) => (
                                <CarouselItem key={employee.id} className="h-full pl-0">
                                    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-800">
                                        {/* Photo */}
                                        <div className="relative w-28 h-28 mb-4">
                                            <img
                                                src={employee.photo}
                                                alt={`${employee.firstName} ${employee.lastName}`}
                                                className="w-full h-full rounded-full object-cover border-3 border-green-600"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80";
                                                }}
                                            />
                                        </div>

                                        {/* Name */}
                                        <h4 className="text-slate-100 text-xl font-semibold text-center">
                                            {employee.firstName} {employee.lastName}
                                        </h4>

                                        {/* Position */}
                                        {employee.position && (
                                            <p className="text-slate-400 text-sm text-center mt-1">
                                                {employee.position}
                                            </p>
                                        )}

                                        {/* Congratulations */}
                                        <p className="text-green-400 text-sm font-medium mt-4 text-center">
                                            Tug&apos;ilgan kuningiz muborak!
                                        </p>
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

export default BirthdaySlider;
