// Base URL
// TODO bu yerni urlni to'girla
export const baseUrl = "https://localhost:3000";

import {
  BookCheck,
  FileCode,
  GaugeCircle,
  Home,
  MapPin,
  Megaphone,
  MessageSquareMore,
  MonitorPlay,
  Settings2,
} from "lucide-react";

// Navbar links - base navigation only
// Categories are fetched dynamically from backend
export const navLinks = [{ route: "", name: "navLink1", icon: Home }];

export const fullNavLinks = [
  { route: "", name: "navLink1", icon: Home },
  { route: "/books", name: "fullNavLink5", icon: BookCheck },
  { route: "/map", name: "fullNavLink6", icon: MapPin },
];

// Instructor Navbar links
export const instructorNavLinks = [
  {
    label: "Dashboard",
    route: "/admin-secruty",
    icon: GaugeCircle,
  },
  {
    label: "Yangiliklar",
    route: "/admin-secruty/my-courses",
    icon: MonitorPlay,
  },
  {
    label: "Yangilik yaratish",
    route: "/admin-secruty/create-course",
    icon: FileCode,
  },
  {
    label: "Xodimlar",
    route: "/admin-secruty/employees",
    icon: MessageSquareMore,
  },
  {
    label: "Faxriy xodimlar",
    route: "/admin-secruty/honorary-employees",
    icon: BookCheck,
  },
  {
    label: "Tadbirlar",
    route: "/admin-secruty/events",
    icon: MapPin,
  },
  {
    label: "E'lonlar",
    route: "/admin-secruty/announcements",
    icon: Megaphone,
  },
  {
    label: "Display sahifa",
    route: "/display",
    icon: Settings2,
  },
];

// Langs
export const lngs = [
  { route: "uz", label: "O'zbekcha" },
  { route: "kr", label: "Узбекча" },
];

// NOTE: Static categories and newsPosts have been removed.
// All news and category data is now fetched dynamically from the backend API.
// See service/api.service.ts for data fetching functions:
// - getBlogs() - fetches news from backend
// - getCategories() - fetches categories from backend
