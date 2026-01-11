"use client";

import { Star } from "lucide-react";

import { TextAnimate } from "@/components/ui/text-animate";

const ReviewsPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="font-spaceGrotesk text-3xl font-bold">
                <TextAnimate animation="slideUp" by="word">
                    Sharhlar
                </TextAnimate>
            </h1>

            <div className="rounded-xl border bg-card p-8 text-center">
                <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                    Hozircha sharhlar mavjud emas.
                </p>
            </div>
        </div>
    );
};

export default ReviewsPage;
