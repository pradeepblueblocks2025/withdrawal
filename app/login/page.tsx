"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { login } from "@/services/auth.service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    totpCode: "",
    captcha: "",
    pattern: "15368",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await login(form);

      console.log(res);

      localStorage.setItem("admin_token", res.token);
      localStorage.setItem(
        "admin_user",
        JSON.stringify(res.data.username)
      );

      Cookies.set("admin_token", res.token, {
        expires: 7,
        sameSite: "strict",
        secure: false, // true in production with HTTPS
      });

      console.log("Stored:", localStorage.getItem("admin_token"));

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="relative min-h-screen bg-slate-100 dark:bg-[#07111f] flex items-center justify-center p-6">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-7xl bg-white dark:bg-[#0d1728] rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2 border border-slate-200 dark:border-transparent">
        <div className="hidden lg:flex relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-16 items-center justify-center">
          <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 blur-2xl" />
          <div className="absolute w-96 h-96 bg-cyan-400/10 rounded-full bottom-0 right-0 blur-3xl" />

          <div className="text-center relative z-10">
            <Image
              src="/logo.webp"
              width={220}
              height={220}
              alt="Logo"
              priority
              className="mx-auto mb-8"
            />

            <h1 className="text-5xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-blue-100 text-lg mt-5 leading-8">
              Secure access to your administration panel.
              <br />
              Manage everything in one place.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-50 dark:bg-[#101c2e] p-12">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Sign In
            </h2>

            <p className="text-slate-500 dark:text-gray-400 mb-10">
              Enter your credentials below
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    type="email"
                    className="
                      w-full h-14
                      bg-white dark:bg-[#18263d]
                      rounded-xl pl-12 pr-4
                      text-slate-900 dark:text-white
                      outline-none
                      border border-slate-200 dark:border-transparent
                      focus:border-blue-500
                    "
                    placeholder="name@example.com"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    type="password"
                    name="password"
                    className="
                      w-full h-14
                      bg-white dark:bg-[#18263d]
                      rounded-xl pl-12 pr-4
                      text-slate-900 dark:text-white
                      outline-none
                      border border-slate-200 dark:border-transparent
                      focus:border-blue-500
                    "
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">
                  Auth Password
                </label>

                <div className="relative">
                  <ShieldCheck
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <input
                    type="password"
                    name="totpCode"
                    className="
                      w-full h-14
                      bg-white dark:bg-[#18263d]
                      rounded-xl pl-12 pr-4
                      text-slate-900 dark:text-white
                      outline-none
                      border border-slate-200 dark:border-transparent
                      focus:border-blue-500
                    "
                    placeholder="Authentication Password"
                    value={form.totpCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] duration-300 disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
