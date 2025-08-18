"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TableDeletes = dynamic(
  () => import("@/app/(users)/request/delete/util"),
  {
    ssr: false,
    loading: () => (
      <div>
        Loading... <LoadingOutlined />
      </div>
    ),
  }
);
