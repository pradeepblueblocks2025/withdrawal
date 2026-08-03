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
  Hexagon,
  ExternalLink,
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
          flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        <div className="h-[72px] flex items-center justify-between px-5">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl brand-gradient flex items-center justify-center text-white shadow-sm shadow-violet-500/30">
                <Hexagon size={18} />
              </div>
              <h1 className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">
                FortuneNFT
              </h1>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="px-3 space-y-1.5 flex-1 overflow-y-auto">
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
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition
                  ${
                    isActive
                      ? "brand-gradient text-white shadow-md shadow-violet-500/30"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
              >
                <Icon size={18} />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-5 space-y-3">
          {!collapsed && (
            <div className="relative overflow-hidden rounded-2xl banner-gradient p-4 dark:border dark:border-white/5">
              <div className="relative z-10">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Need Help?
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed pr-14">
                  Contact support for withdrawal or wallet issues.
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl brand-gradient px-3 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Contact Support
                  <ExternalLink size={12} />
                </button>
              </div>
              <div className="pointer-events-none absolute -right-2 bottom-0 h-16 w-16 opacity-90">
                <Image
                  src="/withdrawal-banner.png"
                  alt=""
                  fill
                  className="object-contain object-bottom scale-125 dark:mix-blend-screen"
                  sizes="64px"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 text-rose-500 hover:text-rose-400 px-3.5 py-3 rounded-xl w-full hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer text-sm font-medium"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
