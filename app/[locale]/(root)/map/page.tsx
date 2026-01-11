"use client";

import { Clock, MapPin } from "lucide-react";

import { TextAnimate } from "@/components/ui/text-animate";

const MapPage = () => {

    return (
        <div className="container mx-auto min-h-[70vh] max-w-6xl px-4 pt-[15vh]">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
                <div className="rounded-full bg-primary/10 p-6">
                    <MapPin className="h-16 w-16 text-primary" />
                </div>

                <h1 className="font-spaceGrotesk text-4xl font-bold md:text-5xl">
                    <TextAnimate animation="slideUp" by="word">
                        Manzil
                    </TextAnimate>
                </h1>

                <p className="text-muted-foreground max-w-xl text-lg">
                    Bu sahifa tez orada ishga tushiriladi. Biz sizga interaktiv xarita va
                    manzillar haqida ma&apos;lumot taqdim etish ustida ishlamoqdamiz.
                </p>

                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Tez kunda...</span>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
