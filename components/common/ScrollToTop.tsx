"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const SHOW_AFTER_PX = 320;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="
        fixed bottom-5 right-5 z-50
        flex h-10 w-10 items-center justify-center
        rounded-full
        bg-violet-600 text-white
        shadow-lg shadow-violet-600/30
        transition
        hover:bg-violet-500 hover:scale-105
        active:scale-95
        dark:bg-violet-500 dark:shadow-violet-900/40
      "
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
