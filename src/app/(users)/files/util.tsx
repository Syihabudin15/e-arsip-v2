"use client";

import { useUser } from "@/components/contexts/UserContext";
import { IUser } from "@/components/IInterfaces";
import { FilterOption, FormInput } from "@/components/utils/FormUtils";
import { useAccess } from "@/components/utils/PermissionUtil";
import { FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { EProdukType, Files, RootFiles } from "@prisma/client";
import { App, Button, Input, Modal, Table, TableProps } from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { useEffect, useState } from "react";

interface IRoot extends RootFiles {
  Files: Files[];
}

export default function TableRootFiles() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [produkType, setProdukType] = useState<EProdukType>();
  const [resourceType, setResourceType] = useState<string>();
  const [data, setData] = useState<IRoot[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { hasAccess } = useAccess("/files");
  const user = useUser();
  const { modal } = App.useApp();

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/rootfiles?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }${produkType ? "&produkType=" + produkType : ""}${
        resourceType ? "&resourceType=" + resourceType : ""
      }`
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
  }, [search, page, pageSize, produkType, resourceType]);

  const columns: TableProps<IRoot>["columns"] = [
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
      title: "NAMA FILES",
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
      title: "TIPE PRODUK",
      dataIndex: "produkType",
      key: "produkType",
      className: "text-xs",
      width: 150,
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
      title: "JENIS FILE",
      dataIndex: "jenisFile",
      key: "jenisFile",
      className: "text-xs",
      width: 150,
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
            {record.resourceType === "application/pdf" && "FILE (PDF)"}
            {record.resourceType === "image/png,image/jpg,image/jpeg" &&
              "IMAGE (PNG/JPG/JPEG)"}
            {record.resourceType === "video/mp4" && "VIDEO (MP4)"}
          </>
        );
      },
    },
    {
      title: "URUTAN FILE",
      dataIndex: "order",
      key: "order",
      className: "text-xs text-center",
      width: 150,
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
      title: "JUMLAH FILE",
      dataIndex: "total",
      key: "total",
      className: "text-xs text-center",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.Files.length}</>;
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
              <UpsertRootfile
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
            <h1 className="font-bold text-xl">Files Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div className="flex gap-2">
              {hasAccess("write") && (
                <UpsertRootfile getData={getData} user={user} hook={modal} />
              )}
              <FilterOption
                value={produkType}
                onChange={(e: any) => setProdukType(e)}
                items={OProdukType}
                width={120}
              />
              <FilterOption
                value={resourceType}
                onChange={(e: any) => setResourceType(e)}
                items={OResourceType}
                width={120}
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
      scroll={{ x: "max-content", y: 400 }}
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

const UpsertRootfile = ({
  record,
  getData,
  user,
  hook,
}: {
  record?: IRoot;
  getData: Function;
  user?: IUser;
  hook: HookAPI;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IRoot>(record || defaultRootFile);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/rootfiles", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201) {
          hook.success({ title: "BERHASIL", content: res.msg });
          setLoading(false);
          setOpen(false);
          await getData();
          await fetch("/api/sendEmail", {
            method: "POST",
            body: JSON.stringify({
              subject: `${record ? "Update" : "Penambahan"} Data Root File`,
              description: `${user?.fullname} Berhasil ${
                record ? "Update" : "menambahkan"
              } Data Root File ${!record ? "Baru" : ""} ${
                record ? record.name : data.name
              }`,
            }),
          });
        } else {
          hook.error({ title: "ERROR", content: res.msg });
          setLoading(false);
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
        size="small"
        icon={record ? <FormOutlined /> : <PlusCircleOutlined />}
        type="primary"
        onClick={() => setOpen(true)}
        disabled={record && record.Files.length !== 0}
      >
        {!record && "New"}
      </Button>
      <Modal
        open={open}
        title={`${record ? "UPDATE" : "CREATE NEW"} DATA ROOTFILES ${
          record ? record.name.toUpperCase() : ""
        }`}
        loading={loading}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          disabled:
            !data.name || !data.produkType || !data.resourceType || !data.order,
        }}
        onOk={() => handleSubmit()}
      >
        <div className="my-4 flex flex-col gap-1">
          <FormInput
            label="Nama File"
            value={data.name}
            onChange={(e: any) => setData({ ...data, name: e })}
          />
          <FormInput
            label="Tipe Produk"
            value={data.produkType}
            onChange={(e: any) => setData({ ...data, produkType: e })}
            type="option"
            options={OProdukType}
          />
          <FormInput
            label="Jenis File"
            value={data.resourceType}
            onChange={(e: any) => setData({ ...data, resourceType: e })}
            type="option"
            options={OResourceType}
            disable={record && record.Files.length !== 0}
          />
          <FormInput
            label="Urutan Order"
            value={data.order}
            onChange={(e: any) => setData({ ...data, order: Number(e) })}
            type="number"
          />
        </div>
      </Modal>
    </div>
  );
};

const OProdukType = [
  { label: EProdukType.KREDIT, value: EProdukType.KREDIT },
  { label: EProdukType.TABUNGAN, value: EProdukType.TABUNGAN },
  { label: EProdukType.DEPOSITO, value: EProdukType.DEPOSITO },
];
const OResourceType = [
  { label: "FILE PDF", value: "application/pdf" },
  { label: "IMAGE", value: "image/png,image/jpg,image/jpeg" },
  { label: "VIDEO", value: "video/mp4" },
];
const defaultRootFile: IRoot = {
  id: 0,
  name: "",
  resourceType: "application/pdf",
  produkType: "KREDIT",
  status: true,
  order: 1,
  Files: [],
};
