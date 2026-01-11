"use client";

import { AlignCenter, Tag } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LanguageDropdown } from "@/components/shared/language-dropdown";
import Logo from "@/components/shared/logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fullNavLinks, navLinks } from "@/constants";
import { getCategories } from "@/service/categorie.service";
import { ICategorie } from "@/types/service-type";

import GlobalSearch from "./global-search";

const Mobile = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<ICategorie[]>([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <AlignCenter />
        </Button>
      </SheetTrigger>

      <SheetContent side={"left"}>
        <SheetHeader>
          {/* Logo */}
          <Logo />

          <Separator />

          <div className="mt-4 flex flex-col space-y-4">
            {/* Static navigation links */}
            {navLinks.map((nav) => (
              <Link
                key={nav.route}
                href={`/${locale}/${nav.route}`}
                className="hover:text-primary/90 flex gap-3 font-medium transition-all hover:underline lg:hidden"
              >
                <nav.icon className="size-5" />
                {t(`NavbarLink.${nav.name}`)}
              </Link>
            ))}

            {/* Dynamic categories from backend */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/categories/${category.slug}`}
                className="hover:text-primary/90 flex gap-3 font-medium capitalize transition-all hover:underline"
              >
                <Tag className="size-5" />
                {category.title}
              </Link>
            ))}

            <Separator />

            {fullNavLinks.map((nav) => (
              <Link
                key={nav.route}
                href={`/${locale}/${nav.route}`}
                className="hover:text-primary/90 flex gap-3 font-medium transition-all hover:underline"
              >
                <nav.icon className="size-5" />
                {t(`NavbarLink.${nav.name}`)}
              </Link>
            ))}

            <LanguageDropdown isMobile />
          </div>
          <Separator />

          <div className="flex items-center justify-center">
            <GlobalSearch />

            {/* <ModeToggle /> */}
            <AnimatedThemeToggler duration={500} />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Mobile;
