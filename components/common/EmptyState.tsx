"use client";

import { Inbox } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No Records Found",
  description = "Nothing to display.",
}: Props) {
  return (
    <div className="py-20 flex flex-col items-center justify-center">

      <Inbox
        className="text-slate-400 mb-5"
        size={60}
      />

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="text-slate-500 mt-2">
        {description}
      </p>

    </div>
  );
}