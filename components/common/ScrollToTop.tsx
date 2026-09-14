"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SHOW_TOP_AFTER_PX = 200;
const NEAR_BOTTOM_PX = 80;

const buttonClass = `
  flex h-10 w-10 items-center justify-center
  rounded-full
  bg-violet-600 text-white
  shadow-lg shadow-violet-600/30
  transition
  hover:bg-violet-500 hover:scale-105
  active:scale-95
  dark:bg-violet-500 dark:shadow-violet-900/40
`;

export default function ScrollToTop() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const viewport = window.innerHeight || 0;
      const fullHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight || 0
      );
      const maxScroll = Math.max(fullHeight - viewport, 0);
      const distanceFromBottom = maxScroll - scrollY;

      setShowTop(scrollY > SHOW_TOP_AFTER_PX);
      // Show down arrow whenever there is more content below
      setShowBottom(maxScroll > NEAR_BOTTOM_PX && distanceFromBottom > NEAR_BOTTOM_PX);
    };

    update();

    // Content often loads after mount (tables, cards) — re-check height changes
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null;
    resizeObserver?.observe(document.documentElement);
    if (document.body) resizeObserver?.observe(document.body);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const intervalId = window.setInterval(update, 1000);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearInterval(intervalId);
    };
  }, []);

  if (!showTop && !showBottom) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col-reverse gap-2">
      {showBottom && (
        <button
          type="button"
          aria-label="Scroll to bottom"
          onClick={() => {
            const top = Math.max(
              document.documentElement.scrollHeight,
              document.body?.scrollHeight || 0
            );
            window.scrollTo({ top, behavior: "smooth" });
          }}
          className={buttonClass}
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </button>
      )}

      {showTop && (
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={buttonClass}
        >
          <ChevronUp size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
