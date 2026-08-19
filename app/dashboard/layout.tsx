"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed, setCollapsed } = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f5f9] dark:bg-[#0b0c14]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="p-5 lg:p-8 min-h-[calc(100vh-72px)]">{children}</main>
      </div>

      <ScrollToTop />
    </div>
  );
}
