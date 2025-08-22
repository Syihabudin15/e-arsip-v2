"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TablePermohonan = dynamic(
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
export const CreatePermohonan = dynamic(
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
export const UpdatePermohonan = dynamic(
  () => import("@/app/(users)/permohonan-kredit/[id]/util"),
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
export const DeletePermohonan = dynamic(
  () =>
    import("@/app/(users)/permohonan-kredit/util").then(
      (d) => d.DeletePermohonan
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
export const DeleteFiles = dynamic(
  () => import("@/app/(users)/permohonan-kredit/delete/[id]/util"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center">
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
