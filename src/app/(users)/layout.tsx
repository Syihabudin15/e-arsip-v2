"use client";

import { LoadingOutlined } from "@ant-design/icons";
// import { MenuWindows } from "@/components/utils/LayoutUtil";
import dynamic from "next/dynamic";
const MenuWindows = dynamic(
  () => import("@/components/utils/LayoutUtil").then((d) => d.MenuWindows),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

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
