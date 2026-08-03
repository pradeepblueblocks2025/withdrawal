"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Sparkles,
  Cpu,
} from "lucide-react";
import { logout } from "@/lib/auth";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "FortuneNFT",
    href: "/withdrawals",
    icon: Wallet,
  },
  {
    name: "FortuneBall",
    href: "/withdrawals/fortuneball",
    icon: CircleDot,
  },
  {
    name: "Exora",
    href: "/withdrawals/exora",
    icon: Sparkles,
  },
  {
    name: "BTSmart",
    href: "/withdrawals/btsmart",
    icon: Cpu,
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0
          bg-black/50
          z-40
          transition-opacity
          lg:hidden
          ${
            mobileOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          bg-white
          dark:bg-slate-900
          border-r
          border-slate-200
          dark:border-slate-800
          z-50
          transition-all
          duration-300
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <h1 className="text-slate-900 dark:text-white font-bold text-xl">
              FortuneNFT
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-slate-200"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/withdrawals"
                ? pathname === "/withdrawals"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                onClick={() => setMobileOpen(false)}
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <Icon size={20} />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-0 w-full px-4">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 px-4 py-3 rounded-xl w-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <LogOut />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
