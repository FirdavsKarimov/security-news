"use client";

import { format } from "date-fns";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TextAnimate } from "@/components/ui/text-animate";
import {
    deleteNews,
    getAdminNews,
    NewsItem,
} from "@/service/admin-news.service";
import { isAuthenticated } from "@/service/auth.service";

const MyCoursesPage = () => {
    const router = useRouter();
    const locale = useLocale();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin-secruty/login`);
            return;
        }

        fetchNews();
    }, [router, locale]);

    const fetchNews = async () => {
        const result = await getAdminNews(1, 50);
        if (result.success && result.data) {
            setNews(result.data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu yangilikni o'chirishni xohlaysizmi?")) return;

        setDeleting(id);
        const result = await deleteNews(id);
        if (result.success) {
            setNews((prev) => prev.filter((item) => item._id !== id));
        } else {
            alert(result.error || "O'chirishda xatolik yuz berdi");
        }
        setDeleting(null);
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-spaceGrotesk text-3xl font-bold">
                    <TextAnimate animation="slideUp" by="word">
                        Yangiliklar boshqaruvi
                    </TextAnimate>
                </h1>
                <Button
                    onClick={() => router.push(`/${locale}/admin-secruty/create-course`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi yangilik
                </Button>
            </div>

            {news.length === 0 ? (
                <div className="rounded-xl border bg-card p-8 text-center">
                    <p className="text-muted-foreground">
                        Hozircha yangiliklar mavjud emas. Yangi yangilik yaratish uchun
                        &quot;Yangi yangilik&quot; tugmasini bosing.
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50%]">Sarlavha</TableHead>
                                <TableHead>Kategoriya</TableHead>
                                <TableHead>Sana</TableHead>
                                <TableHead>Holat</TableHead>
                                <TableHead className="text-right">Amallar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">
                                        <div className="line-clamp-2">{item.title}</div>
                                    </TableCell>
                                    <TableCell>
                                        {item.categories?.length > 0 && (
                                            <Badge variant="secondary" className="capitalize">
                                                {item.categories[0].name}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(new Date(item.createdAt), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={item.isPublished ? "default" : "outline"}
                                            className={
                                                item.isPublished ? "bg-green-500" : "text-orange-500"
                                            }
                                        >
                                            {item.isPublished ? "Chop etilgan" : "Qoralama"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/${locale}/news/${item.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    router.push(
                                                        `/${locale}/admin-secruty/create-course?edit=${item._id}`
                                                    )
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(item._id)}
                                                disabled={deleting === item._id}
                                            >
                                                {deleting === item._id ? (
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default MyCoursesPage;
