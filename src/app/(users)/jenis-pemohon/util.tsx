"use client";

import { FormInput } from "@/components/utils/FormUtils";
import {
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { JenisPemohon } from "@prisma/client";
import { Button, Input, Modal, Table, TableProps, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export default function TableJenisPemohon() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [data, setData] = useState<JenisPemohon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/jenis-pemohon?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: JenisPemohon) => ({ ...d, key: d.id })));
        setTotal(res.total);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page, pageSize]);

  const columns: TableProps<JenisPemohon>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      className: "text-xs text-center",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{(page - 1) * pageSize + (index + 1)}</>;
      },
    },
    {
      title: "JENIS PEMOHON",
      dataIndex: "name",
      key: "name",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.name}</>;
      },
    },
    {
      title: "KETERANGAN",
      dataIndex: "keterangan",
      key: "keterangan",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              {record.keterangan}
            </Paragraph>
          </>
        );
      },
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      key: "createdAt",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.createdAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "UPDATED AT",
      dataIndex: "updatedAt",
      key: "updatedAt",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.updatedAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      className: "text-xs",
      width: 80,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex gap-2 justify-center" key={record.id}>
            <UpsertJenisPemohon data={record} getData={getData} />
            <DeleteJenisPemohon data={record} getData={getData} />
          </div>
        );
      },
    },
  ];

  return (
    <Table
      title={() => (
        <div>
          <div className="border-b border-blue-500 py-2">
            <h1 className="font-bold text-xl">Jenis Pemohon</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div className="flex gap-2">
              <UpsertJenisPemohon getData={getData} />
            </div>
            <div className="w-42">
              <Input.Search
                size="small"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      columns={columns}
      size="small"
      bordered
      loading={loading}
      dataSource={data}
      scroll={{ x: "max-content", y: 370 }}
      pagination={{
        size: "small",
        total: total,
        pageSizeOptions: [50, 100, 500, 1000, 10000],
        defaultPageSize: pageSize,
        onChange(page, pageSize) {
          setPage(page);
          setPageSize(pageSize);
        },
      }}
    />
  );
}

const UpsertJenisPemohon = ({
  data,
  getData,
}: {
  data?: JenisPemohon;
  getData: Function;
}) => {
  const [tempData, setTempData] = useState(data || defaultJenisPemohon);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if ("key" in tempData) {
      delete tempData.key;
    }
    await fetch("/api/jenis-pemohon", {
      method: data ? "PUT" : "POST",
      body: JSON.stringify({ ...tempData, updatedAt: new Date() }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          Modal.success({
            title: "BERHASIL",
            content: `Data ${data ? data.name : tempData.name} berhasil ${
              data ? "di Update" : "Ditambahkan"
            }`,
          });
          getData();
          setOpen(false);
          return;
        }
        Modal.error({ title: "ERROR", content: res.msg });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        Modal.error({ title: "ERROR", content: "Internal Server Error" });
      });
    setLoading(false);
  };

  return (
    <div>
      <Button
        icon={data ? <FormOutlined /> : <PlusCircleOutlined />}
        size="small"
        type="primary"
        onClick={() => setOpen(true)}
        loading={loading}
      >
        {!data && "New"}
      </Button>
      <Modal
        title={`${
          data
            ? "UPDATE " + data.name.toUpperCase()
            : "TAMBAH JENIS PEMOHON BARU"
        }`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => handleSubmit()}
        loading={loading}
        okButtonProps={{ loading: loading, disabled: !tempData.name }}
      >
        <div className="flex flex-col gap-2 my-4">
          <FormInput
            label="Jenis Pemohon"
            value={tempData.name}
            onChange={(e: any) => setTempData({ ...tempData, name: e })}
            required
          />
          <FormInput
            label="Keterangan"
            value={tempData.keterangan}
            onChange={(e: any) => setTempData({ ...tempData, keterangan: e })}
          />
        </div>
      </Modal>
    </div>
  );
};

const DeleteJenisPemohon = ({
  data,
  getData,
}: {
  data: JenisPemohon;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if ("key" in data) {
      delete data.key;
    }
    await fetch("/api/jenis-pemohon", {
      method: data ? "PUT" : "POST",
      body: JSON.stringify({ ...data, status: false, updatedAt: new Date() }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          Modal.success({
            title: "BERHASIL",
            content: `Data ${data && data.name} berhasil dihapus`,
          });
          getData();
          setOpen(false);
          return;
        }
        Modal.error({ title: "ERROR", content: res.msg });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        Modal.error({ title: "ERROR", content: "Internal Server Error" });
      });
    setLoading(false);
  };
  return (
    <div>
      <Button
        icon={<DeleteOutlined />}
        size="small"
        type="primary"
        danger
        onClick={() => setOpen(true)}
        loading={loading}
      ></Button>
      <Modal
        title={`HAPUS ${data.name.toUpperCase()}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => handleSubmit()}
        loading={loading}
        okButtonProps={{ loading: loading }}
      >
        <div className="my-4">
          <p>Apakah anda yakin ingin menghapus Jenis Pemohon ini?</p>
        </div>
      </Modal>
    </div>
  );
};

const defaultJenisPemohon: JenisPemohon = {
  id: 1,
  name: "",
  keterangan: "",
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
