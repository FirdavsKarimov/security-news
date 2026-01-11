"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import Logo from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Meteors } from "@/components/ui/meteors";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "@/constants";
import { getCategories } from "@/service/categorie.service";
import { ICategorie } from "@/types/service-type";

function Footer() {
  const t = useTranslations();
  const [categories, setCategories] = useState<ICategorie[]>([]);

  const locale = useLocale();

  useEffect(() => {
    const fetchBlogs = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-secondary relative mt-12 overflow-hidden border-t px-2 pt-12 max-md:px-4">
      <Meteors number={30} />
      <div className="container mx-auto max-w-7xl pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col space-y-3 md:col-span-2">
            <Logo />
            <p>{t("Footer.description")}</p>
          </div>

          <div className="flex flex-col">
            <h1 className="font-spaceGrotesk text-3xl">{t("Footer.pages")}</h1>
            <div className="flex flex-col gap-1 pt-6">
              {navLinks.map((item) => (
                <Link
                  key={item.route}
                  href={`/${locale}/${item.route}`}
                  className="hover:text-primary text-muted-foreground font-medium transition-all hover:underline"
                >
                  {t(`NavbarLink.${item.name}`)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="font-spaceGrotesk text-3xl">{t("categories")}</h1>
            <div className="flex flex-wrap gap-1 pt-6">
              {categories.slice(-5).map((item) => (
                <Link key={item.slug} href={`/${locale}/categories/${item.slug}`}>
                  <Badge className="hover:bg-primary/75 cursor-pointer px-3 py-1 text-white capitalize transition-all">
                    {item.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12">
          <Separator className="bg-muted-foreground mb-3 dark:bg-gray-500" />
          <p className="text-muted-foreground flex items-center justify-center">
            © {new Date().getFullYear()} - {t("Footer.copyright")}
          </p>
        </div>
      </div>
    </div>
  );
}
export default Footer;
