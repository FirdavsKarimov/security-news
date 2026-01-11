"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LanguageDropdown } from "@/components/shared/language-dropdown";
import Logo from "@/components/shared/logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { getCategories } from "@/service/categorie.service";
import { ICategorie } from "@/types/service-type";

import GlobalSearch from "./global-search";
import Mobile from "./mobile";

const Navbar = () => {
  const t = useTranslations("NavbarLink");
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<ICategorie[]>([]);

  // Scroll paytida navbarni o'zgartirish
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.slice(0, 4)); // Show first 4 categories in navbar
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-3 z-50 flex w-full justify-center transition-all duration-500 ease-in-out",
        isScrolled ? "top-0 left-0 w-full" : "",
      )}
    >
      <div
        className={cn(
          "bg-background/70 from-background/50 to-primary/20 container flex h-20 w-7xl items-center justify-between rounded-xl border-b bg-gradient-to-r px-4 shadow-md backdrop-blur-xl transition-all duration-500 ease-in-out",
          isScrolled
            ? "bg-background/80 from-background/50 to-primary/20 w-full border-none bg-gradient-to-bl shadow-lg backdrop-blur-md"
            : "mx-auto",
        )}
      >
        <div className="flex items-center gap-4">
          <Logo />

          <div className="hidden items-center gap-3 border-l pl-2 lg:flex">
            {/* Static navigation links */}
            {navLinks.map((nav) => (
              <Link
                key={nav.route}
                href={`/${locale}/${nav.route}`}
                className={cn(
                  "hover:text-primary font-medium transition-all hover:underline",
                )}
              >
                {t(nav.name)}
              </Link>
            ))}

            {/* Dynamic categories from backend */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/categories/${category.slug}`}
                className={cn(
                  "hover:text-primary font-medium capitalize transition-all hover:underline",
                )}
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="hidden lg:flex">
              <GlobalSearch />
              <LanguageDropdown />
            </div>
            {/* <ModeToggle /> */}
            <AnimatedThemeToggler duration={500} />
            <Mobile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
