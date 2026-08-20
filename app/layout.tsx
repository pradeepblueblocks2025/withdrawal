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
      { url: "/favicon.ico?v=4" },
      { url: "/favicon.png?v=4", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32.png?v=4", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=4" }],
    shortcut: ["/favicon.ico?v=4"],
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
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" href="/favicon.png?v=4" type="image/png" sizes="512x512" />
        <link rel="icon" href="/favicon-32.png?v=4" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=4" />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
