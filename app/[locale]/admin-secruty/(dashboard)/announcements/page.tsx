"use client";

import { Edit, Megaphone, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { isAuthenticated } from "@/service/auth.service";
import {
    Announcement,
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncements,
    updateAnnouncement,
} from "@/service/admin.service";

const AnnouncementsPage = () => {
    const router = useRouter();
    const locale = useLocale();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin-secruty/login`);
            return;
        }
        loadAnnouncements();
    }, [router, locale]);

    const loadAnnouncements = async () => {
        setLoading(true);
        const result = await getAnnouncements(1, 100);
        if (result.success && result.data) {
            setAnnouncements(result.data);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setExpiresAt("");
        setIsActive(true);
        setEditingAnnouncement(null);
        setError("");
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setTitle(announcement.title);
        setContent(announcement.content || "");
        setExpiresAt(announcement.expiresAt ? announcement.expiresAt.split("T")[0] : "");
        setIsActive(announcement.isActive);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        let result;
        if (editingAnnouncement) {
            result = await updateAnnouncement(editingAnnouncement._id, {
                title,
                content: content || undefined,
                isActive,
                expiresAt: expiresAt || null,
            });
        } else {
            result = await createAnnouncement({
                title,
                content: content || undefined,
                expiresAt: expiresAt || undefined,
            });
        }

        if (result.success) {
            setShowModal(false);
            resetForm();
            loadAnnouncements();
        } else {
            setError(result.error || "Xatolik yuz berdi");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
        const result = await deleteAnnouncement(id);
        if (result.success) {
            loadAnnouncements();
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Megaphone className="h-8 w-8 text-indigo-500" />
                    <h1 className="text-2xl font-bold">E&apos;lonlar</h1>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Qo&apos;shish
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sarlavha</TableHead>
                            <TableHead>Matn</TableHead>
                            <TableHead>Yaratilgan</TableHead>
                            <TableHead>Amal qilish muddati</TableHead>
                            <TableHead>Holat</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    E&apos;lonlar topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            announcements.map((ann) => (
                                <TableRow key={ann._id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        {ann.title}
                                    </TableCell>
                                    <TableCell className="max-w-[250px] truncate text-muted-foreground">
                                        {ann.content || "-"}
                                    </TableCell>
                                    <TableCell>{formatDate(ann.createdAt)}</TableCell>
                                    <TableCell>
                                        {ann.expiresAt ? formatDate(ann.expiresAt) : "Cheksiz"}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${ann.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {ann.isActive ? "Faol" : "Nofaol"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditModal(ann)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Tahrirlash
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(ann._id)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    O&apos;chirish
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {editingAnnouncement ? "E'lonni tahrirlash" : "Yangi e'lon qo'shish"}
                        </h2>

                        {error && (
                            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Sarlavha *</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="E'lon sarlavhasi"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Matn</Label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="E'lon matni (ixtiyoriy)"
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Amal qilish muddati</Label>
                                <Input
                                    type="date"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Bo&apos;sh qoldirilsa, cheksiz amal qiladi</p>
                            </div>

                            {editingAnnouncement && (
                                <div className="flex items-center justify-between">
                                    <Label>Faol holat</Label>
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={setIsActive}
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                                    Bekor qilish
                                </Button>
                                <Button type="submit" className="flex-1" disabled={submitting}>
                                    {submitting ? "Saqlanmoqda..." : "Saqlash"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsPage;
