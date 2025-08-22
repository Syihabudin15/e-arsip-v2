"use client";

import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
const DashboardMaster = dynamic(() => import("@/app/(users)/dashboard/util"), {
  ssr: false,
  loading: () => (
    <>
      Loading .. <LoadingOutlined />
    </>
  ),
});
export default function Page() {
  return (
    <div>
      <DashboardMaster />
    </div>
  );
}
