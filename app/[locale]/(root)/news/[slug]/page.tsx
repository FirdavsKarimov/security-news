import { format } from "date-fns";
import parse from "html-react-parser";
import { CalendarDays, Clock, Minus, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { getLocalizedValue, getReadingTime } from "@/lib/utils";
import { getBlog } from "@/service/blog.service";

import ShareBtns from "../../_components/share-btns";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const t = await getTranslations();
  const locale = await getLocale();

  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl pt-[15vh] max-md:px-2">
      <h1 className="font-creteRound text-4xl md:text-5xl lg:text-6xl">
        <TypingAnimation showCursor={false}>
          {getLocalizedValue(blog, "title", locale)}
        </TypingAnimation>
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 max-md:justify-center">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <p>
            {
              getReadingTime(
                getLocalizedValue(blog, "description", locale).html,
                t("minRead"),
              ).text
            }
          </p>
        </div>
        <Minus />
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          <p>{format(blog.createdAt, "dd/MM/yyyy")}</p>
        </div>

        <div className="flex items-center gap-2">
          {blog.categories?.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/categories/${category.slug}`}
            >
              <Badge
                className={"cursor-pointer font-semibold text-white capitalize"}
              >
                <Tag />
                {category.title}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <Image
        src={blog.image.url}
        alt={getLocalizedValue(blog, "title", locale)}
        width={"1120"}
        height={"595"}
        className="mt-4 rounded-md"
      />

      <div className="relative mt-12 flex max-md:flex-col-reverse md:gap-12">
        <div className="flex flex-col space-y-3">
          <div className="sticky top-[100px]">
            <ShareBtns />
          </div>
        </div>
        <div className="prose dark:prose-invert flex-1">
          {parse(getLocalizedValue(blog, "description", locale).html)}
        </div>
      </div>
    </div>
  );
};

export default Page;
