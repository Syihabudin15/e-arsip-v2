"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const TableRole = dynamic(() => import("@/app/(users)/roles/util"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex justify-center items-center">
      Loading ... <LoadingOutlined />
    </div>
  ),
});
export const UpsertRole = dynamic(
  () => import("@/app/(users)/roles/create/util"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center">
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
export const UpdateRole = dynamic(
  () => import("@/app/(users)/roles/[id]/util"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center">
        Loading ... <LoadingOutlined />
      </div>
    ),
  }
);
