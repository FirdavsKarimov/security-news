"use client";

import { ImageIcon, Loader2, Save, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TextAnimate } from "@/components/ui/text-animate";
import { Textarea } from "@/components/ui/textarea";
import {
    CategoryItem,
    createNews,
    getAdminCategories,
    getNewsById,
    updateNews,
    uploadImage,
} from "@/service/admin-news.service";
import { isAuthenticated } from "@/service/auth.service";

const CreateCoursePage = () => {
    const router = useRouter();
    const locale = useLocale();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<CategoryItem[]>([]);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isPublished, setIsPublished] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin-secruty/login`);
            return;
        }

        // Fetch categories
        const fetchData = async () => {
            const catResult = await getAdminCategories();
            if (catResult.success && catResult.data) {
                setCategories(catResult.data);
            }

            // If editing, fetch news data
            if (editId) {
                const newsResult = await getNewsById(editId);
                if (newsResult.success && newsResult.data) {
                    const news = newsResult.data;
                    setTitle(news.title);
                    setContent(news.content);
                    setSummary(news.summary || "");
                    setImageUrl(news.image);
                    setIsPublished(news.isPublished);
                    if (news.categories?.length > 0) {
                        setCategory(news.categories[0].id);
                    } else if (news.category) {
                        setCategory(news.category._id);
                    }
                }
            }
        };

        fetchData();
    }, [router, locale, editId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const result = await uploadImage(file);
        if (result.success && result.url) {
            setImageUrl(result.url);
        } else {
            alert(result.error || "Rasm yuklashda xatolik");
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content || !category || !imageUrl) {
            alert("Iltimos, barcha maydonlarni to'ldiring");
            return;
        }

        setLoading(true);

        const newsData = {
            title,
            content,
            summary,
            categories: [category],
            image: imageUrl,
            isPublished,
        };

        let result;
        if (editId) {
            result = await updateNews(editId, newsData);
        } else {
            result = await createNews(newsData);
        }

        if (result.success) {
            router.push(`/${locale}/admin-secruty/my-courses`);
        } else {
            alert(result.error || "Xatolik yuz berdi");
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <h1 className="font-spaceGrotesk text-3xl font-bold">
                <TextAnimate animation="slideUp" by="word">
                    {editId ? "Yangilikni tahrirlash" : "Yangi yangilik yaratish"}
                </TextAnimate>
            </h1>

            <div className="rounded-xl border bg-card p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Sarlavha *</Label>
                        <Input
                            id="title"
                            placeholder="Yangilik sarlavhasini kiriting..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                        <Label htmlFor="summary">Qisqacha tavsif</Label>
                        <Textarea
                            id="summary"
                            placeholder="Yangilik haqida qisqacha..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={2}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Matn *</Label>
                        <Textarea
                            id="content"
                            placeholder="Yangilik matnini kiriting..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Kategoriya *</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Kategoriyani tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Rasm *</Label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yuklanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Rasm yuklash
                                    </>
                                )}
                            </Button>
                            {imageUrl && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <ImageIcon className="h-4 w-4" />
                                    Rasm yuklangan
                                </div>
                            )}
                        </div>
                        {imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="h-32 w-auto rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Published */}
                    <div className="flex items-center space-x-4">
                        <Switch
                            id="published"
                            checked={isPublished}
                            onCheckedChange={setIsPublished}
                        />
                        <Label htmlFor="published">Chop etish</Label>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saqlanmoqda...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {editId ? "Saqlash" : "Yaratish"}
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateCoursePage;
