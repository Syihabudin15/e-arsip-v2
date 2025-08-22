"use client";

import { Spin } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { IPermohonan } from "@/components/IInterfaces";
import { CreatePermohonan } from "..";

export default function UpdatePermohonanKredit({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IPermohonan>();

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
        <CreatePermohonan record={data} type={data.Produk.produkType} />
      ) : (
        <div>
          Memuat ... <LoadingOutlined />
        </div>
      )}
    </Spin>
  );
}
