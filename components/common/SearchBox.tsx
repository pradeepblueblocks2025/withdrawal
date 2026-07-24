"use client";

import { Search, X } from "lucide-react";

interface SearchBoxProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SearchBox({
  value,
  placeholder = "Search...",
  onChange,
}: SearchBoxProps) {
  return (
    <div className="relative w-full">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          h-11
          rounded-xl
          border
          border-slate-300
          dark:border-slate-700
          bg-white
          dark:bg-slate-800
          pl-11
          pr-10
          text-sm
          outline-none
          transition-all
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            hover:bg-slate-200
            dark:hover:bg-slate-700
            transition
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}