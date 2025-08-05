"use client";

import { Spin } from "antd";
import { useEffect, useState } from "react";
import { CreatePermohonanKredit } from "..";
import { IPermohonanKredit } from "@/components/IInterfaces";
import { LoadingOutlined } from "@ant-design/icons";

export default function UpdatePermohonanKredit({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IPermohonanKredit>();

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetch("/api/permohonan/find?id=" + id)
        .then((res) => res.json())
        .then((res) => {
          if (res.data) {
            setData(res.data);
          }
        });
    })();
    setLoading(false);
  }, []);

  return (
    <Spin spinning={loading}>
      {data ? (
        <CreatePermohonanKredit record={data} />
      ) : (
        <div>
          Memuat ... <LoadingOutlined />
        </div>
      )}
    </Spin>
  );
}
