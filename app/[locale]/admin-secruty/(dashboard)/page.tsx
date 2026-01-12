"use client";

import {
  Award,
  CalendarDays,
  FileText,
  Layers,
  LogOut,
  Megaphone,
  Newspaper,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { getFullDashboardStats } from "@/service/admin.service";
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
  const [stats, setStats] = useState({
    newsCount: 0,
    categoryCount: 0,
    employeeCount: 0,
    honoraryEmployeeCount: 0,
    eventCount: 0,
    announcementCount: 0,
  });
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
      const data = await getFullDashboardStats();
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Yangiliklar"
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
          title="Xodimlar"
          value={stats.employeeCount}
          icon={Users}
          color="bg-pink-500"
        />
        <StatsCard
          title="Faxriy xodimlar"
          value={stats.honoraryEmployeeCount}
          icon={Award}
          color="bg-amber-500"
        />
        <StatsCard
          title="Tadbirlar"
          value={stats.eventCount}
          icon={CalendarDays}
          color="bg-indigo-500"
        />
        <StatsCard
          title="E'lonlar"
          value={stats.announcementCount}
          icon={Megaphone}
          color="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Tezkor harakatlar</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/create-course`)}
          >
            <FileText className="h-6 w-6" />
            <span className="text-xs">Yangilik yaratish</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/my-courses`)}
          >
            <Newspaper className="h-6 w-6" />
            <span className="text-xs">Yangiliklar</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/employees`)}
          >
            <Users className="h-6 w-6 text-pink-500" />
            <span className="text-xs">Xodimlar</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/honorary-employees`)}
          >
            <Award className="h-6 w-6 text-amber-500" />
            <span className="text-xs">Faxriy xodimlar</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/events`)}
          >
            <CalendarDays className="h-6 w-6 text-indigo-500" />
            <span className="text-xs">Tadbirlar</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/admin-secruty/announcements`)}
          >
            <Megaphone className="h-6 w-6 text-purple-500" />
            <span className="text-xs">E'lonlar</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-6"
            onClick={() => router.push(`/${locale}/display`)}
          >
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">Display sahifa</span>
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
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg ${color} p-2.5`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

