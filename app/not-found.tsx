import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6">
                <h1 className="font-spaceGrotesk text-9xl font-bold text-primary">
                    404
                </h1>
                <h2 className="text-3xl font-semibold">Sahifa topilmadi</h2>
                <p className="text-muted-foreground max-w-md">
                    Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan
                    bo&apos;lishi mumkin.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link href="/">
                        <Button size="lg">Bosh sahifaga qaytish</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
