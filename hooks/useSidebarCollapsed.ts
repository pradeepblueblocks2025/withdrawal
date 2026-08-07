"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebar_collapsed";

export function useSidebarCollapsed() {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setCollapsedState(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setCollapsed = (value: boolean | ((prev: boolean) => boolean)) => {
    setCollapsedState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return { collapsed, setCollapsed };
}
