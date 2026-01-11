"use client";

import {
  FileText,
  Layers,
  LogOut,
  Newspaper,
  TrendingUp,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { getDashboardStats } from "@/service/admin-news.service";
import {
  getStoredAdmin,
  isAuthenticated,
  logout,
} from "@/service/auth.service";

const DashboardPage = () => {
  const router = useRouter();
  const locale = useLocale();
  const [admin, setAdmin] = useState<{
    username: string;
    role: string;
  } | null>(null);
  const [stats, setStats] = useState({ newsCount: 0, categoryCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push(`/${locale}/admin-secruty/login`);
      return;
    }

    // Get admin data
    const storedAdmin = getStoredAdmin();
    if (storedAdmin) {
      setAdmin({
        username: storedAdmin.username,
        role: storedAdmin.role,
      });
    }

    // Fetch stats
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, [router, locale]);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/admin-secruty/login`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-spaceGrotesk text-3xl font-bold">
            <TextAnimate animation="slideUp" by="word">
              Dashboard
            </TextAnimate>
          </h1>
          {admin && (
            <p className="mt-1 text-muted-foreground">
              Xush kelibsiz, <span className="font-medium">{admin.username}</span>{" "}
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">
                {admin.role}
              </span>
            </p>
          )}
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Chiqish
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Jami yangiliklar"
          value={stats.newsCount}
          icon={Newspaper}
          color="bg-blue-500"
        />
        <StatsCard
          title="Kategoriyalar"
          value={stats.categoryCount}
          icon={Layers}
          color="bg-green-500"
        />
        <StatsCard
          title="Foydalanuvchilar"
          value={1}
          icon={User}
          color="bg-purple-500"
        />
        <StatsCard
          title="Ko'rishlar"
          value="-"
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Tezkor harakatlar</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/create-course`)}
          >
            <FileText className="h-8 w-8" />
            <span>Yangilik yaratish</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/my-courses`)}
          >
            <Newspaper className="h-8 w-8" />
            <span>Yangiliklar ro&apos;yxati</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}`)}
          >
            <TrendingUp className="h-8 w-8" />
            <span>Saytni ko&apos;rish</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg ${color} p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
