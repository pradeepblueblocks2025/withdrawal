"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SHOW_TOP_AFTER_PX = 320;
const NEAR_BOTTOM_PX = 120;

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
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = fullHeight - (scrollY + viewport);

      setShowTop(scrollY > SHOW_TOP_AFTER_PX);
      setShowBottom(fullHeight > viewport + NEAR_BOTTOM_PX && distanceFromBottom > NEAR_BOTTOM_PX);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!showTop && !showBottom) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
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

      {showBottom && (
        <button
          type="button"
          aria-label="Scroll to bottom"
          onClick={() => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
          }}
          className={buttonClass}
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
