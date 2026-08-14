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
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
          border-slate-200
          dark:border-white/10
          bg-slate-50
          dark:bg-[#1c1f30]
          pl-11
          pr-10
          text-sm
          text-slate-900
          dark:text-slate-100
          placeholder:text-slate-400
          dark:placeholder:text-slate-500
          outline-none
          transition-all
          hover:border-slate-300
          dark:hover:border-white/20
          hover:bg-white
          dark:hover:bg-[#22263a]
          focus:border-indigo-400
          dark:focus:border-violet-500
          focus:ring-2
          focus:ring-indigo-500/15
          dark:focus:ring-violet-500/20
          focus:bg-white
          dark:focus:bg-[#22263a]
          autofill:bg-slate-50
          dark:autofill:bg-[#1c1f30]
          [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#f8fafc]
          dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1c1f30]
          [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]
          dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f1f5f9]
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-slate-400
            hover:bg-slate-200
            hover:text-slate-600
            dark:hover:bg-slate-700
            dark:hover:text-slate-200
            transition
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
