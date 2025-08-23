"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TableRootFiles = dynamic(
  () => import("@/app/(users)/files/util"),
  {
    ssr: false,
    loading: () => (
      <div>
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
