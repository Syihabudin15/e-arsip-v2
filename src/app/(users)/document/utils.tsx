"use client";

import { IPemohon, IPermohonan, IUser } from "@/components/IInterfaces";
import { FilterOption, FormInput } from "@/components/utils/FormUtils";
import {
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { JenisPemohon, Pemohon } from "@prisma/client";
import { App, Button, Input, Modal, Table, TableProps } from "antd";
import { useEffect, useState } from "react";

import { useAccess } from "@/components/utils/PermissionUtil";
import moment from "moment";
import { DetailPermohonan } from "../permohonan-kredit";
import { HookAPI } from "antd/es/modal/useModal";
import { useUser } from "@/components/contexts/UserContext";

export default function TableDokumen() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [jenisId, setJenisId] = useState<number>();
  const [data, setData] = useState<IPemohon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jeniss, setJeniss] = useState<JenisPemohon[]>([]);
  const { hasAccess } = useAccess("/document");
  const { modal } = App.useApp();
  const user = useUser();

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/document?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }${jenisId ? "&jenisId=" + jenisId : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setTotal(res.total);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
      await fetch("/api/jenis-pemohon")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) setJeniss(res.data);
        });
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page, pageSize, jenisId]);

  const columns: TableProps<IPemohon>["columns"] = [
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
      fixed: window && window.innerWidth > 600 ? "left" : false,
    },
    {
      title: "NOMOR CIF",
      dataIndex: "accountNumber",
      key: "account",
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
      fixed: window && window.innerWidth > 600 ? "left" : false,
    },
    {
      title: "NAMA DEBITUR",
      dataIndex: "fullname",
      key: "fullname",
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
      fixed: window && window.innerWidth > 600 ? "left" : false,
    },
    {
      title: "NOMOR NIK",
      dataIndex: "NIK",
      key: "nik",
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
      title: "JENIS PEMOHON",
      dataIndex: ["JenisPemohon", "name"],
      key: "jenisPemohon",
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
              <UpsertPemohon
                getData={getData}
                jeniss={jeniss}
                record={record}
                hook={modal}
              />
            )}
            {hasAccess("delete") && (
              <DeletePemohon record={record} hook={modal} getData={getData} />
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
            <h1 className="font-bold text-xl">Dokumen</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between overflow-auto">
            <div className="flex gap-2">
              {hasAccess("write") && (
                <UpsertPemohon getData={getData} jeniss={jeniss} hook={modal} />
              )}
              <FilterOption
                items={jeniss.map((j) => ({ label: j.name, value: j.id }))}
                value={jenisId}
                onChange={(e: number) => setJenisId(e)}
                width={150}
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
      expandable={{
        expandedRowRender: (record) => (
          <TablePermohonan data={record.Permohonan} hasAccess={hasAccess} />
        ),
        rowExpandable: (record) => record.Permohonan.length !== 0,
      }}
    />
  );
}

const TablePermohonan = ({
  data,
  hasAccess,
}: {
  data: IPermohonan[];
  hasAccess: Function;
}) => {
  const columns: TableProps<IPermohonan>["columns"] = [
    {
      title: "PRODUK TYPE",
      dataIndex: ["Produk", "produkType"],
      key: "produkType",
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
      title: "NAMA PRODUK",
      dataIndex: ["Produk", "name"],
      key: "produkName",
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
      title: "TUJUAN PENGGUNAAN",
      dataIndex: "purposeUse",
      key: "purposeUse",
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
      title: "MARKETING",
      dataIndex: ["User", "fullname"],
      key: "marketing",
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
      title: "ACTION",
      dataIndex: "action",
      key: "action",
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
      render(value, record, index) {
        return (
          <div className="flex justify-center">
            {hasAccess("detail") && (
              <DetailPermohonan data={record} hasAccess={hasAccess} />
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        rowKey={"id"}
        columns={columns}
        size="small"
        bordered
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

const UpsertPemohon = ({
  record,
  getData,
  jeniss,
  hook,
  user,
}: {
  record?: Pemohon;
  getData: Function;
  jeniss: JenisPemohon[];
  hook: HookAPI;
  user?: IUser;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Pemohon>(record || defaultPemohon);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/pemohon", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify({
        id: data.id,
        fullname: data.fullname,
        NIK: data.NIK,
        accountNumber: data.accountNumber,
        jenisPemohonId: data.jenisPemohonId,
      }),
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
              subject: `${record ? "Update" : "Tambah"} data pemohon ${
                data.fullname
              }`,
              description: `${user?.fullname} Berhasil ${
                record ? "Update" : "Tambah"
              } data pemohon ${
                data.fullname
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
        size="small"
        type="primary"
        onClick={() => setOpen(true)}
      >
        {!record && "New"}
      </Button>
      <Modal
        open={open}
        title={`${record ? "UPDATE" : "TAMBAH"} DATA PEMOHON ${
          record ? record.fullname.toUpperCase() : ""
        }`}
        onCancel={() => setOpen(false)}
        onOk={() => handleSubmit()}
        loading={loading}
        okButtonProps={{
          disabled:
            !data.accountNumber ||
            !data.NIK ||
            !data.fullname ||
            !data.jenisPemohonId,
        }}
      >
        <div className="my-4 flex flex-col gap-1">
          <FormInput
            label="NO CIF"
            value={data.accountNumber}
            type="number"
            onChange={(e: any) =>
              setData({ ...data, accountNumber: String(e) })
            }
            required
          />
          <FormInput
            label="NAMA PEMOHON"
            value={data.fullname}
            onChange={(e: any) => setData({ ...data, fullname: e })}
            required
          />
          <FormInput
            label="NIK"
            value={data.NIK}
            type="number"
            onChange={(e: any) => setData({ ...data, NIK: String(e) })}
            required
          />
          <FormInput
            label="JENIS PEMOHON"
            value={data.jenisPemohonId !== 0 ? data.jenisPemohonId : undefined}
            type="option"
            onChange={(e: any) => setData({ ...data, jenisPemohonId: e })}
            required
            options={jeniss.map((j) => ({ label: j.name, value: j.id }))}
          />
        </div>
      </Modal>
    </div>
  );
};

const DeletePemohon = ({
  record,
  getData,
  hook,
  user,
}: {
  record: IPemohon;
  getData: Function;
  hook: HookAPI;
  user?: IUser;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/pemohon", {
      method: "DELETE",
      body: JSON.stringify({
        id: record.id,
        status: false,
      }),
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
              subject: `Hapus data pemohon ${record.fullname}`,
              description: `${user?.fullname} Berhasil menghapus data pemohon ${record.fullname}`,
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
        size="small"
        type="primary"
        danger
        onClick={() => setOpen(true)}
      ></Button>
      <Modal
        open={open}
        title={`HAPUS DATA PEMOHON ${
          record ? record.fullname.toUpperCase() : ""
        }`}
        onCancel={() => setOpen(false)}
        onOk={() => handleSubmit()}
        loading={loading}
      >
        <div className="my-4">
          <p>
            Lanjutkan untuk hapus data pemohon {record.fullname.toUpperCase()}?
          </p>
        </div>
        <div className="my-4 flex flex-col gap-1">
          <FormInput
            label="NO CIF"
            value={record.accountNumber}
            type="number"
            required
            disable
          />
          <FormInput
            label="NAMA PEMOHON"
            value={record.fullname}
            required
            disable
          />
          <FormInput
            label="NIK"
            value={record.NIK}
            type="number"
            required
            disable
          />
          <FormInput
            label="JENIS PEMOHON"
            value={record.JenisPemohon.name}
            required
            disable
          />
          <FormInput
            label="TOTAL PERMOHONAN"
            value={record.Permohonan.length}
            type="number"
            required
            disable
          />
        </div>
      </Modal>
    </div>
  );
};

const defaultPemohon: Pemohon = {
  id: 0,
  fullname: "",
  NIK: "",
  accountNumber: "",
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  jenisPemohonId: 0,
};
