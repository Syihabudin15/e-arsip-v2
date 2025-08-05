"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TablePermohonanKredit = dynamic(
  () => import("@/app/(users)/permohonan-kredit/util"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center">
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
export const CreatePermohonanKredit = dynamic(
  () => import("@/app/(users)/permohonan-kredit/create/util"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center">
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
export const DetailPermohonan = dynamic(
  () =>
    import("@/app/(users)/permohonan-kredit/util").then(
      (d) => d.DetailPermohonan
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center">
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
