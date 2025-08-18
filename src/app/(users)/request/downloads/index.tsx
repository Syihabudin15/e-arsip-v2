"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TableDownload = dynamic(
  () => import("@/app/(users)/request/downloads/util"),
  {
    ssr: false,
    loading: () => (
      <div>
        Loading... <LoadingOutlined />
      </div>
    ),
  }
);
