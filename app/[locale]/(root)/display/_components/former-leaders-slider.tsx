"use client";

import Autoplay from "embla-carousel-autoplay";
import { Award } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { fetchHonoraryEmployees } from "@/service/api.service";

interface HonoraryEmployee {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
    position?: string;
    workPeriod?: string;
    startDate: string;
    endDate: string;
}

const FormerLeadersSlider = () => {
    const [employees, setEmployees] = useState<HonoraryEmployee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchHonoraryEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Failed to load honorary employees:", error);
            } finally {
                setLoading(false);
            }
        };
        loadEmployees();
    }, []);

    const getWorkPeriod = (employee: HonoraryEmployee) => {
        if (employee.workPeriod) return employee.workPeriod;
        const startYear = new Date(employee.startDate).getFullYear();
        const endYear = new Date(employee.endDate).getFullYear();
        return `${startYear} - ${endYear}`;
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-900/80 to-amber-800/80 rounded-2xl">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-300 border-t-transparent" />
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-900/80 to-amber-800/80 rounded-2xl">
                <Award className="h-12 w-12 text-amber-300/50 mb-2" />
                <p className="text-amber-200/60 text-lg">Faxriy xodimlar yo'q</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-gradient-to-br from-amber-900/90 to-amber-800/90 rounded-2xl overflow-hidden p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-amber-300" />
                <h3 className="text-amber-100 text-xl font-bold">Faxriy Xodimlar</h3>
            </div>

            {/* Slider */}
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
                className="flex-1"
            >
                <CarouselContent className="h-full -ml-0">
                    {employees.map((employee) => (
                        <CarouselItem key={employee.id} className="h-full pl-0">
                            <div className="h-full flex flex-col items-center justify-center p-4">
                                {/* Photo */}
                                <div className="relative w-36 h-36 mb-4">
                                    <img
                                        src={employee.photo}
                                        alt={`${employee.firstName} ${employee.lastName}`}
                                        className="w-full h-full rounded-full object-cover border-4 border-amber-400/50"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/150x150?text=👤";
                                        }}
                                    />
                                </div>

                                {/* Name */}
                                <h4 className="text-amber-100 text-2xl font-bold text-center">
                                    {employee.firstName} {employee.lastName}
                                </h4>

                                {/* Position */}
                                {employee.position && (
                                    <p className="text-amber-200/80 text-lg text-center mt-1">
                                        {employee.position}
                                    </p>
                                )}

                                {/* Work Period */}
                                <p className="text-amber-300 text-lg font-medium mt-2">
                                    {getWorkPeriod(employee)} yillar
                                </p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default FormerLeadersSlider;
