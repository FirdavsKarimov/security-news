"use client";

import { motion } from "framer-motion";
import { Cake, PartyPopper, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SparklesText } from "@/components/ui/sparkles-text";
import { fetchTodayBirthdays } from "@/service/api.service";

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
    birthDate: string;
    position?: string;
}

const BirthdayWidget = () => {
    const t = useTranslations();
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
            <div className="rounded-xl border p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-primary/70 pb-2 mb-4">
                    <Cake className="h-5 w-5 text-pink-500" />
                    <h3 className="text-lg font-bold">{t("employees.todayBirthdays")}</h3>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            </div>
        );
    }

    if (birthdays.length === 0) {
        return (
            <div className="rounded-xl border p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-primary/70 pb-2 mb-4">
                    <Cake className="h-5 w-5 text-pink-500" />
                    <h3 className="text-lg font-bold">{t("employees.todayBirthdays")}</h3>
                </div>
                <p className="text-muted-foreground text-sm text-center py-4">
                    {t("employees.noBirthdays")}
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border p-5 shadow-sm bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20"
        >
            <div className="flex items-center gap-2 border-b border-primary/70 pb-2 mb-4">
                <PartyPopper className="h-5 w-5 text-pink-500 animate-bounce" />
                <SparklesText className="text-lg font-bold">
                    {t("employees.todayBirthdays")}
                </SparklesText>
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </div>

            <div className="space-y-4">
                {birthdays.map((employee, index) => (
                    <motion.div
                        key={employee.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-pink-200 dark:border-pink-800"
                    >
                        <div className="relative">
                            <img
                                src={employee.photo}
                                alt={`${employee.firstName} ${employee.lastName}`}
                                className="h-14 w-14 rounded-full object-cover border-2 border-pink-400"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/56x56?text=👤";
                                }}
                            />
                            <div className="absolute -top-1 -right-1 text-lg">🎂</div>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-foreground">
                                {employee.firstName} {employee.lastName}
                            </p>
                            {employee.position && (
                                <p className="text-xs text-muted-foreground">{employee.position}</p>
                            )}
                            <p className="text-xs text-pink-600 dark:text-pink-400 font-medium mt-1">
                                🎉 {t("employees.happyBirthday")}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default BirthdayWidget;
