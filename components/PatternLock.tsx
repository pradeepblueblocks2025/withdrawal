"use client";

import { useRef, useState } from "react";

interface Props {
  onComplete: (pattern: string) => void;
}

export default function PatternLock({ onComplete }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const drawing = useRef(false);

  const start = (id: number) => {
    drawing.current = true;
    setSelected([id]);
  };

  const enter = (id: number) => {
    if (!drawing.current) return;

    setSelected((prev) => {
      if (prev.includes(id)) return prev;

      const updated = [...prev, id];

      return updated;
    });
  };

  const end = () => {
    drawing.current = false;

    onComplete(selected.join(""));

    setTimeout(() => {
      setSelected([]);
    }, 300);
  };

  return (
    <div
      onMouseUp={end}
      onMouseLeave={end}
      className="grid grid-cols-3 gap-8 w-72 h-72 bg-white rounded-lg p-6 select-none"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          onMouseDown={() => start(i + 1)}
          onMouseEnter={() => enter(i + 1)}
          className={`w-12 h-12 rounded-full mx-auto cursor-pointer transition
          ${
            selected.includes(i + 1)
              ? "bg-black"
              : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}