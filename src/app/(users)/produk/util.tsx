"use client";

import { useUser } from "@/components/contexts/UserContext";
import { IUser } from "@/components/IInterfaces";
import { FormInput } from "@/components/utils/FormUtils";
import { useAccess } from "@/components/utils/PermissionUtil";
import {
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { EProdukType, Produk } from "@prisma/client";
import { App, Button, Input, Modal, Select, Table, TableProps } from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TableProduk() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [data, setData] = useState<Produk[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [produkType, setProdukType] = useState<EProdukType>();
  const { hasAccess } = useAccess("/roles");
  const user = useUser();
  const { modal } = App.useApp();

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/produk?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }${produkType ? "&produkType=" + produkType : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setTotal(res.total);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page, pageSize, produkType]);

  const columns: TableProps<Produk>["columns"] = [
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
      title: "PRODUK CODE",
      dataIndex: "code",
      key: "code",
      className: "text-xs",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
    },
    {
      title: "PRODUK NAME",
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
    },
    {
      title: "PRODUK TYPE",
      dataIndex: "produkType",
      key: "type",
      className: "text-xs",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
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
            {hasAccess("update") && (
              <UpserProduk
                record={record}
                user={user}
                hook={modal}
                getData={getData}
              />
            )}
            {hasAccess("delete") && (
              <DeleteProduk
                record={record}
                getData={getData}
                user={user}
                hook={modal}
              />
            )}
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
            <h1 className="font-bold text-xl">Produk Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div className="flex gap-2">
              {hasAccess("write") && (
                <UpserProduk user={user} hook={modal} getData={getData} />
              )}
              <Select
                options={optionProdukType}
                size="small"
                placeholder="Filter"
                style={{ width: 150 }}
                onChange={(e: EProdukType) => setProdukType(e)}
                allowClear
              />
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
      rowKey={"id"}
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

const UpserProduk = ({
  record,
  user,
  hook,
  getData,
}: {
  record?: Produk;
  user?: IUser;
  hook: HookAPI;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Produk>(record || defaultProduk);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/produk", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201) {
          hook.success({ title: "BERHASIL", content: res.msg });
          setOpen(false);
          await getData();
          await fetch("/api/sendEmail", {
            method: "POST",
            body: JSON.stringify({
              subject: `${record ? "Update" : "Tambah"} data Produk ${
                data.name
              }`,
              description: `${user?.fullname} Berhasil ${
                record ? "Update" : "Tambah"
              } data produk ${
                data.name
              }. <br/><br/> Data Baru : ${JSON.stringify(data)}`,
            }),
          });
        } else {
          hook.error({ title: "ERROR", content: res.msg });
        }
      })
      .catch((err) => {
        console.log(err);
        hook.error({ title: "ERROR", content: "Internal Server Error" });
      });
    setLoading(false);
  };

  return (
    <div>
      <Button
        icon={record ? <FormOutlined /> : <PlusCircleOutlined />}
        onClick={() => setOpen(true)}
        size="small"
        type="primary"
      >
        {!record && "New"}
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={`${record ? "UPDAET" : "CREATE NEW"} DATA PRODUK ${
          record ? `${record.name.toUpperCase()} (${record.code})` : ""
        }`}
        okButtonProps={{
          disabled: !data.code || !data.name || !data.produkType,
          loading: loading,
        }}
        onOk={() => handleSubmit()}
        loading={loading}
      >
        <div className="my-4 flex flex-col gap-1">
          <FormInput
            label="KODE PRODUK"
            value={data.code}
            onChange={(e: any) => setData({ ...data, code: e })}
          />
          <FormInput
            label="NAMA PRODUK"
            value={data.name}
            onChange={(e: any) => setData({ ...data, name: e })}
          />
          <FormInput
            label="TIPE PRODUK"
            type="option"
            value={data.produkType}
            onChange={(e: any) => setData({ ...data, produkType: e })}
            options={[
              { label: EProdukType.KREDIT, value: EProdukType.KREDIT },
              { label: EProdukType.TABUNGAN, value: EProdukType.TABUNGAN },
              { label: EProdukType.DEPOSITO, value: EProdukType.DEPOSITO },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

const DeleteProduk = ({
  record,
  user,
  hook,
  getData,
}: {
  record: Produk;
  user?: IUser;
  hook: HookAPI;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/produk", {
      method: "PUT",
      body: JSON.stringify({ ...record, status: false }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201) {
          hook.success({ title: "BERHASIL", content: res.msg });
          setOpen(false);
          await getData();
          await fetch("/api/sendEmail", {
            method: "POST",
            body: JSON.stringify({
              subject: `Hapus data Produk ${record.name}`,
              description: `${user?.fullname} Berhasil hapus data produk ${record.name} (${record.code}).`,
            }),
          });
        } else {
          hook.error({ title: "ERROR", content: res.msg });
        }
      })
      .catch((err) => {
        console.log(err);
        hook.error({ title: "ERROR", content: "Internal Server Error" });
      });
    setLoading(false);
  };

  return (
    <div>
      <Button
        icon={<DeleteOutlined />}
        danger
        onClick={() => setOpen(true)}
        size="small"
        type="primary"
      >
        {!record && "New"}
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={`HAPUS DATA PRODUK ${record.name}`}
        okButtonProps={{
          loading: loading,
        }}
        onOk={() => handleSubmit()}
        loading={loading}
      >
        <div className="my-4">
          <p>Apakah anda yakin untuk menghapus data Produk {record.name}?</p>
        </div>
        <div className="my-4 flex flex-col gap-1">
          <FormInput label="KODE PRODUK" value={record.code} disable />
          <FormInput label="NAMA PRODUK" value={record.name} disable />
          <FormInput label="TIPE PRODUK" value={record.produkType} disable />
        </div>
      </Modal>
    </div>
  );
};

const defaultProduk: Produk = {
  id: 0,
  code: "",
  name: "",
  status: true,
  produkType: EProdukType.TABUNGAN,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const optionProdukType = [
  { label: EProdukType.DEPOSITO, value: EProdukType.DEPOSITO },
  { label: EProdukType.TABUNGAN, value: EProdukType.TABUNGAN },
  { label: EProdukType.KREDIT, value: EProdukType.KREDIT },
];
