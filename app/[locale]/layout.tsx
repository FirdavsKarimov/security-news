/* eslint-disable import/order */
import type { Metadata } from "next";
import { Roboto, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/theme-provider";
import { ChildProps } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { LightRays } from "@/components/ui/light-rays";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-spaceGrotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Bukhara Info",
  description: "Bukhara Info - abucoders",
};

interface RootLayoutProps extends ChildProps {
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${spaceGrotesk.variable} overflow-x-hidden antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ScrollProgress className="bottom-0 z-[100] h-0.5" />

            {children}

            <Toaster />
            <LightRays />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
