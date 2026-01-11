"use client";

import { CalendarDays, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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
    createEvent,
    deleteEvent,
    Event,
    getEvents,
    updateEvent,
} from "@/service/admin.service";

const EventsPage = () => {
    const router = useRouter();
    const locale = useLocale();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin-secruty/login`);
            return;
        }
        loadEvents();
    }, [router, locale]);

    const loadEvents = async () => {
        setLoading(true);
        const result = await getEvents(1, 100);
        if (result.success && result.data) {
            setEvents(result.data);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setEventDate("");
        setPhotos([]);
        setPhotoPreviews([]);
        setEditingEvent(null);
        setError("");
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setTitle(event.title);
        setDescription(event.description || "");
        setEventDate(event.eventDate.split("T")[0]);
        setPhotoPreviews(event.photos);
        setShowModal(true);
    };

    const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setPhotos(files);
            setPhotoPreviews(files.map((f) => URL.createObjectURL(f)));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("eventDate", eventDate);
        if (description) formData.append("description", description);
        photos.forEach((photo) => formData.append("photos", photo));

        let result;
        if (editingEvent) {
            if (photos.length > 0) {
                formData.append("replacePhotos", "true");
            }
            result = await updateEvent(editingEvent._id, formData);
        } else {
            if (photos.length === 0) {
                setError("Kamida bitta rasm majburiy");
                setSubmitting(false);
                return;
            }
            result = await createEvent(formData);
        }

        if (result.success) {
            setShowModal(false);
            resetForm();
            loadEvents();
        } else {
            setError(result.error || "Xatolik yuz berdi");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
        const result = await deleteEvent(id);
        if (result.success) {
            loadEvents();
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getPhotoUrl = (photo: string) => {
        if (photo.startsWith("http")) return photo;
        return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${photo}`;
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
                    <CalendarDays className="h-8 w-8 text-blue-500" />
                    <h1 className="text-2xl font-bold">Tadbirlar (Ishxona yangiliklari)</h1>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Qo'shish
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rasmlar</TableHead>
                            <TableHead>Nomi</TableHead>
                            <TableHead>Tavsif</TableHead>
                            <TableHead>Sana</TableHead>
                            <TableHead>Holat</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Tadbirlar topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((evt) => (
                                <TableRow key={evt._id}>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {evt.photos.slice(0, 3).map((photo, i) => (
                                                <img
                                                    key={i}
                                                    src={getPhotoUrl(photo)}
                                                    alt={evt.title}
                                                    className="h-10 w-10 rounded-lg object-cover border-2 border-background"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://via.placeholder.com/40?text=📷";
                                                    }}
                                                />
                                            ))}
                                            {evt.photos.length > 3 && (
                                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                                                    +{evt.photos.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        {evt.title}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                        {evt.description || "-"}
                                    </TableCell>
                                    <TableCell>{formatDate(evt.eventDate)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${evt.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {evt.isActive ? "Faol" : "Nofaol"}
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
                                                <DropdownMenuItem onClick={() => openEditModal(evt)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Tahrirlash
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(evt._id)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    O'chirish
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
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingEvent ? "Tadbirni tahrirlash" : "Yangi tadbir qo'shish"}
                        </h2>

                        {error && (
                            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tadbir nomi *</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tavsif</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tadbir sanasi *</Label>
                                <Input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Rasmlar {!editingEvent && "*"} (bir nechta tanlash mumkin)</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotosChange}
                                />
                                {photoPreviews.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {photoPreviews.map((preview, i) => (
                                            <img
                                                key={i}
                                                src={preview}
                                                alt={`Preview ${i}`}
                                                className="h-16 w-16 rounded-lg object-cover"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

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

export default EventsPage;
