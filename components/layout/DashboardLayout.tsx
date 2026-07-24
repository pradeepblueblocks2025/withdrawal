// app/dashboard/layout.tsx

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">

      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">

        <Header />

        <main className="flex-1 p-6">
          {children}
        </main>

        <Footer />

      </div>

    </div>
  );
}