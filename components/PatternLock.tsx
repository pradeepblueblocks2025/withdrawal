"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onComplete: (pattern: string) => void;
  onChange?: (pattern: string) => void;
  size?: number;
}

const DOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function getPointFromEvent(
  container: HTMLElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function hitDot(
  container: HTMLElement,
  clientX: number,
  clientY: number
): number | null {
  const elements = container.querySelectorAll<HTMLElement>("[data-dot]");
  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.max(rect.width, rect.height) * 0.75;
    const dx = clientX - cx;
    const dy = clientY - cy;
    if (dx * dx + dy * dy <= radius * radius) {
      return Number(el.dataset.dot);
    }
  }
  return null;
}

export default function PatternLock({
  onComplete,
  onChange,
  size = 260,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const pathRef = useRef<number[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [dotCenters, setDotCenters] = useState<
    Record<number, { x: number; y: number }>
  >({});

  const measureDots = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const next: Record<number, { x: number; y: number }> = {};
    const rect = container.getBoundingClientRect();
    container.querySelectorAll<HTMLElement>("[data-dot]").forEach((el) => {
      const id = Number(el.dataset.dot);
      const dotRect = el.getBoundingClientRect();
      next[id] = {
        x: dotRect.left + dotRect.width / 2 - rect.left,
        y: dotRect.top + dotRect.height / 2 - rect.top,
      };
    });
    setDotCenters(next);
  }, []);

  useEffect(() => {
    measureDots();
    window.addEventListener("resize", measureDots);
    return () => window.removeEventListener("resize", measureDots);
  }, [measureDots, size]);

  const addDot = (id: number) => {
    if (pathRef.current.includes(id)) return;
    const next = [...pathRef.current, id];
    pathRef.current = next;
    setPath(next);
    onChange?.(next.join(""));
  };

  const startAt = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    measureDots();
    const id = hitDot(container, clientX, clientY);
    if (id == null) return;

    drawingRef.current = true;
    pathRef.current = [];
    setPath([]);
    addDot(id);
    setCursor(getPointFromEvent(container, clientX, clientY));
  };

  const moveAt = (clientX: number, clientY: number) => {
    if (!drawingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const id = hitDot(container, clientX, clientY);
    if (id != null) addDot(id);
    setCursor(getPointFromEvent(container, clientX, clientY));
  };

  const finish = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setCursor(null);

    const pattern = pathRef.current.join("");
    if (pattern.length >= 4) {
      onComplete(pattern);
    } else {
      onChange?.("");
      pathRef.current = [];
      setPath([]);
    }
  };

  const linePoints = path
    .map((id) => dotCenters[id])
    .filter(Boolean) as { x: number; y: number }[];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none touch-none rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#18263d]"
      style={{ width: size, height: size }}
      onMouseDown={(e) => {
        e.preventDefault();
        startAt(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => moveAt(e.clientX, e.clientY)}
      onMouseUp={finish}
      onMouseLeave={finish}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        startAt(touch.clientX, touch.clientY);
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        e.preventDefault();
        moveAt(touch.clientX, touch.clientY);
      }}
      onTouchEnd={finish}
      onTouchCancel={finish}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {linePoints.length > 1 && (
          <polyline
            points={linePoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgb(99 102 241)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {linePoints.length > 0 && cursor && (
          <line
            x1={linePoints[linePoints.length - 1].x}
            y1={linePoints[linePoints.length - 1].y}
            x2={cursor.x}
            y2={cursor.y}
            stroke="rgb(99 102 241)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.45"
          />
        )}
      </svg>

      <div className="grid h-full w-full grid-cols-3 place-items-center gap-2">
        {DOTS.map((id) => {
          const active = path.includes(id);
          return (
            <div
              key={id}
              data-dot={id}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${
                active
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                  : "border-slate-300 bg-slate-100 text-slate-500 dark:border-white/15 dark:bg-[#101c2e] dark:text-slate-400"
              }`}
            >
              <span className="text-xs font-semibold">{id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
