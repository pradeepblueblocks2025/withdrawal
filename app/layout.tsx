import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/theme-script";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FortuneNFT Admin",
  description: "Admin Dashboard",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3" },
      { url: "/logo-f.png?v=3", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/logo-f.png?v=3" }],
    shortcut: ["/favicon.ico?v=3"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakarta.variable}>
      <head>
        <ThemeScript />
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" href="/logo-f.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-f.png?v=3" />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
