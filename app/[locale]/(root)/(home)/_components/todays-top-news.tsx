"use client";

import { motion } from "framer-motion";
import { MoveRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import NewsCard from "@/components/cards/news-card";
import { TextAnimate } from "@/components/ui/text-animate";
import { getBlogs } from "@/service/blog.service";
import { INews } from "@/types/service-type";

const TodaysTopNews = () => {
  const t = useTranslations();
  const [newsPosts, setNewsPosts] = useState<INews[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      setNewsPosts(data);
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2 className="font-spaceGrotesk border-primary/70 inline-block border-b-2 pb-1 text-3xl font-bold">
        <TextAnimate animation="slideLeft" by="character">
          {t("todaysTopNews")}
        </TextAnimate>
      </h2>

      <div className="grid grid-cols-2 gap-4 pt-8 max-md:grid-cols-1">
        {newsPosts.slice(0, 8).map((post, index) => (
          <NewsCard key={post.id} index={index} post={post} />
        ))}

        {newsPosts.length >= 9 && (
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 8 * 0.2 }}
            viewport={{ once: true }}
            className="flex items-center justify-center rounded-2xl border"
          >
            <div className="max-md:p-3">
              <p className="flex size-9 cursor-pointer items-center justify-center rounded-full border">
                <MoveRightIcon className="transform animate-pulse" />
              </p>
            </div>
          </motion.article>
        )}
      </div>
    </div>
  );
};

export default TodaysTopNews;

