"use client";

import Link from "next/link";
import Image from "next/image";
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
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
          ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      <aside
        className={`
          fixed top-0 left-0 h-screen
          bg-white dark:bg-[#12141f]
          border-r border-slate-100 dark:border-white/5
          z-50 transition-all duration-300 lg:translate-x-0
          flex flex-col overflow-visible
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div
          className={`
            flex h-[72px] items-center justify-between px-4 gap-2
            ${
              collapsed
                ? "lg:h-auto lg:min-h-[88px] lg:flex-col lg:items-center lg:justify-center lg:gap-2 lg:py-3 lg:px-3"
                : ""
            }
          `}
        >
          <div
            className={`flex items-center min-w-0 gap-2.5 ${
              collapsed ? "lg:gap-0 lg:justify-center" : ""
            }`}
          >
            <Image
              src="/logo-f.png"
              alt="FortuneNFT"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl shadow-sm shadow-violet-500/30 object-cover shrink-0"
              priority
            />
            <h1
              className={`text-slate-900 dark:text-white font-bold text-lg tracking-tight truncate ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              FortuneNFT
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden lg:flex h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 items-center justify-center cursor-pointer shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="px-3 space-y-1.5 flex-1 overflow-visible">
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
                className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition
                  ${collapsed ? "lg:justify-center lg:px-0" : ""}
                  ${
                    isActive
                      ? "brand-gradient text-white shadow-md shadow-violet-500/30"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className={collapsed ? "lg:hidden" : ""}>{item.name}</span>

                {collapsed && (
                  <span
                    className="
                      pointer-events-none absolute left-full top-1/2 z-[60] ml-3
                      -translate-y-1/2 whitespace-nowrap
                      rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white
                      opacity-0 shadow-lg transition duration-150
                      group-hover:opacity-100
                      dark:bg-violet-600
                      max-lg:hidden
                    "
                  >
                    {item.name}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-violet-600" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-5 overflow-x-visible">
          <button
            type="button"
            onClick={logout}
            className={`group relative flex items-center gap-3 text-rose-500 hover:text-rose-400 px-3.5 py-3 rounded-xl w-full hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer text-sm font-medium ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>

            {collapsed && (
              <span
                className="
                  pointer-events-none absolute left-full top-1/2 z-[60] ml-3
                  -translate-y-1/2 whitespace-nowrap
                  rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white
                  opacity-0 shadow-lg transition duration-150
                  group-hover:opacity-100
                  dark:bg-violet-600
                  max-lg:hidden
                "
              >
                Logout
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-violet-600" />
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
