"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TextAnimate } from "@/components/ui/text-animate";

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="font-spaceGrotesk text-3xl font-bold">
                <TextAnimate animation="slideUp" by="word">
                    Sozlamalar
                </TextAnimate>
            </h1>

            <div className="rounded-xl border bg-card p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold">Profil ma&apos;lumotlari</h3>
                        <p className="text-sm text-muted-foreground">
                            Shaxsiy ma&apos;lumotlaringizni tahrirlang
                        </p>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ism</Label>
                            <Input id="name" placeholder="Ismingiz..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="email@example.com" />
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold">Xavfsizlik</h3>
                        <p className="text-sm text-muted-foreground">
                            Parolingizni o&apos;zgartiring
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">Yangi parol</Label>
                            <Input id="password" type="password" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Parolni tasdiqlang</Label>
                            <Input id="confirm" type="password" placeholder="••••••••" />
                        </div>
                    </div>

                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Saqlash
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
