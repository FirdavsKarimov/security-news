import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export default async function NotFound() {
    const t = await getTranslations();
    const locale = await getLocale();

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-[15vh] text-center">
            <div className="space-y-6">
                <h1 className="font-spaceGrotesk text-9xl font-bold text-primary">
                    404
                </h1>
                <h2 className="text-3xl font-semibold">{t("notFound.title")}</h2>
                <p className="text-muted-foreground max-w-md">
                    {t("notFound.description")}
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link href={`/${locale}`}>
                        <Button size="lg">{t("notFound.backHome")}</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
