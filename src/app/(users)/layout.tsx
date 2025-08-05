"use client";

import { MenuWindows } from "@/components/utils/LayoutUtil";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1">
      <div className="border-r border-gray-100">
        <MenuWindows />
      </div>
      <div className="min-w-96">{children}</div>
    </div>
  );
}
