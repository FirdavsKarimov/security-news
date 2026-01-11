"use client";

import { Edit, MoreHorizontal, Plus, Trash2, Users } from "lucide-react";
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
    createEmployee,
    deleteEmployee,
    Employee,
    getEmployees,
    updateEmployee,
} from "@/service/admin.service";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';

const getImageUrl = (photo: string) => {
    if (!photo) return "https://via.placeholder.com/48?text=👤";
    if (photo.startsWith("http")) return photo;
    if (photo.startsWith("blob:")) return photo;
    return `${API_BASE}${photo}`;
};

const EmployeesPage = () => {
    const router = useRouter();
    const locale = useLocale();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [position, setPosition] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState("");

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin-secruty/login`);
            return;
        }
        loadEmployees();
    }, [router, locale]);

    const loadEmployees = async () => {
        setLoading(true);
        const result = await getEmployees(1, 100);
        if (result.success && result.data) {
            setEmployees(result.data);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setPosition("");
        setBirthDate("");
        setPhoto(null);
        setPhotoPreview("");
        setEditingEmployee(null);
        setError("");
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (employee: Employee) => {
        setEditingEmployee(employee);
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setPosition(employee.position || "");
        setBirthDate(employee.birthDate.split("T")[0]);
        setPhotoPreview(employee.photo);
        setShowModal(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("birthDate", birthDate);
        if (position) formData.append("position", position);
        if (photo) formData.append("photo", photo);

        let result;
        if (editingEmployee) {
            result = await updateEmployee(editingEmployee._id, formData);
        } else {
            if (!photo) {
                setError("Rasm majburiy");
                setSubmitting(false);
                return;
            }
            result = await createEmployee(formData);
        }

        if (result.success) {
            setShowModal(false);
            resetForm();
            loadEmployees();
        } else {
            setError(result.error || "Xatolik yuz berdi");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
        const result = await deleteEmployee(id);
        if (result.success) {
            loadEmployees();
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
                    <Users className="h-8 w-8 text-pink-500" />
                    <h1 className="text-2xl font-bold">Xodimlar (Tug'ilgan kunlar)</h1>
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
                            <TableHead>Rasm</TableHead>
                            <TableHead>Ism Familiya</TableHead>
                            <TableHead>Lavozim</TableHead>
                            <TableHead>Tug'ilgan sana</TableHead>
                            <TableHead>Holat</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Xodimlar topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((emp) => (
                                <TableRow key={emp._id}>
                                    <TableCell>
                                        <img
                                            src={getImageUrl(emp.photo)}
                                            alt={`${emp.firstName}`}
                                            className="h-12 w-12 rounded-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://via.placeholder.com/48?text=👤";
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {emp.firstName} {emp.lastName}
                                    </TableCell>
                                    <TableCell>{emp.position || "-"}</TableCell>
                                    <TableCell>{formatDate(emp.birthDate)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${emp.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {emp.isActive ? "Faol" : "Nofaol"}
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
                                                <DropdownMenuItem onClick={() => openEditModal(emp)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Tahrirlash
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(emp._id)} className="text-destructive">
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
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {editingEmployee ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
                        </h2>

                        {error && (
                            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ism *</Label>
                                    <Input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Familiya *</Label>
                                    <Input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Lavozim</Label>
                                <Input
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tug'ilgan sana *</Label>
                                <Input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Rasm {!editingEmployee && "*"}</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                                {photoPreview && (
                                    <img
                                        src={getImageUrl(photoPreview)}
                                        alt="Preview"
                                        className="h-20 w-20 rounded-lg object-cover mt-2"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/80?text=👤";
                                        }}
                                    />
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

export default EmployeesPage;
