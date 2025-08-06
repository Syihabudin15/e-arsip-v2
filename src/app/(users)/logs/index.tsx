"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TableLogs = dynamic(() => import("@/app/(users)/logs/util"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex justify-center items-center">
      Loading ... <LoadingOutlined />
    </div>
  ),
});
