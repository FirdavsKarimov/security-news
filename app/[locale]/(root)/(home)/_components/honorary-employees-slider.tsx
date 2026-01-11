"use client";

import Autoplay from "embla-carousel-autoplay";
import { Award, Calendar } from "lucide-react";
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
import { fetchHonoraryEmployees } from "@/service/api.service";

interface HonoraryEmployee {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
    position?: string;
    startDate: string;
    endDate: string;
    workPeriod?: string;
}

const HonoraryEmployeesSlider = () => {
    const t = useTranslations();
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

    // Helper function to format work period
    const getWorkPeriod = (employee: HonoraryEmployee) => {
        if (employee.workPeriod) return employee.workPeriod;
        const startYear = new Date(employee.startDate).getFullYear();
        const endYear = new Date(employee.endDate).getFullYear();
        return `${startYear} - ${endYear}`;
    };

    if (loading) {
        return (
            <div className="py-12">
                <div className="container mx-auto max-w-7xl px-2">
                    <div className="flex items-center gap-3 mb-8">
                        <Award className="h-8 w-8 text-amber-600" />
                        <h2 className="text-3xl font-bold">{t("honoraryEmployees.title")}</h2>
                    </div>
                    <div className="flex items-center justify-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                </div>
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="py-12 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
                <div className="container mx-auto max-w-7xl px-2">
                    <div className="flex items-center gap-3 mb-8">
                        <Award className="h-8 w-8 text-amber-600" />
                        <h2 className="font-spaceGrotesk border-primary/70 border-b-2 pb-1 text-3xl font-bold">
                            <TextAnimate animation="slideLeft" by="character">
                                {t("honoraryEmployees.title")}
                            </TextAnimate>
                        </h2>
                    </div>
                    <div className="text-center py-12 text-muted-foreground">
                        <Award className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p>Hozircha faxriy xodimlar yo&apos;q</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
            <div className="container mx-auto max-w-7xl px-2">
                <div className="flex items-center gap-3 mb-8">
                    <Award className="h-8 w-8 text-amber-600" />
                    <h2 className="font-spaceGrotesk border-primary/70 border-b-2 pb-1 text-3xl font-bold">
                        <TextAnimate animation="slideLeft" by="character">
                            {t("honoraryEmployees.title")}
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
                            delay: 4000,
                            stopOnInteraction: false,
                            stopOnMouseEnter: true,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {employees.map((employee) => (
                            <CarouselItem
                                key={employee.id}
                                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                                <div className="p-1">
                                    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-amber-200 dark:border-amber-800 hover:shadow-xl transition-shadow">
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={employee.photo}
                                                alt={`${employee.firstName} ${employee.lastName}`}
                                                className="w-full h-full object-cover transition-transform hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://via.placeholder.com/300x300?text=👤";
                                                }}
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                            {/* Work period badge */}
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-sm font-medium">
                                                        {getWorkPeriod(employee)} {t("honoraryEmployees.workedYears")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-foreground">
                                                {employee.firstName} {employee.lastName}
                                            </h3>
                                            {employee.position && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {employee.position}
                                                </p>
                                            )}
                                        </div>
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

export default HonoraryEmployeesSlider;
