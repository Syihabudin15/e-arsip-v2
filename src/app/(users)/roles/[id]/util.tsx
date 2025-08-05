"use client";

import { Role } from "@prisma/client";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { UpsertRole } from "..";
import { LoadingOutlined } from "@ant-design/icons";

export default function UpdateRole({ id }: { id: string }) {
  const [data, setData] = useState<Role>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetch("/api/role/find?id=" + id)
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            setData(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <Spin spinning={loading}>
      {data ? (
        <UpsertRole record={data} />
      ) : (
        <div>
          Memuat ... <LoadingOutlined />
        </div>
      )}
    </Spin>
  );
}
