"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TableJenisPemohon = dynamic(
  () => import("@/app/(users)/jenis-pemohon/util"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center">
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
