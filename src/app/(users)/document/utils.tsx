"use client";

import {
  EditActivity,
  IExcelColumn,
  IExcelData,
  IFileList,
  IPermohonanKredit,
} from "@/components/IInterfaces";
import { FilterOption } from "@/components/utils/FormUtils";
import { DeleteFilled, FormOutlined, LoadingOutlined } from "@ant-design/icons";
import { JenisPemohon } from "@prisma/client";
import { Button, Input, Table, TableProps, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
// import { DetailPermohonan } from "../permohonan-kredit";

import { useAccess } from "@/components/utils/PermissionUtil";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ExportData } from "../logs/util";
const { Paragraph } = Typography;

const DetailPermohonan = dynamic(
  () =>
    import("@/app/(users)/permohonan-kredit").then((d) => d.DetailPermohonan),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function TableDokumen() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [jenisId, setJenisId] = useState<number>();
  const [data, setData] = useState<IPermohonanKredit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jeniss, setJeniss] = useState<JenisPemohon[]>([]);
  const { access, hasAccess } = useAccess("/document");

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/permohonan?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }${jenisId ? "&jenisId=" + jenisId : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: IPermohonanKredit) => ({ ...d, key: d.id })));
        setTotal(res.total);
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
          if (res.status === 200)
            setJeniss(res.data.map((d: JenisPemohon) => ({ ...d, key: d.id })));
        });
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page, pageSize, jenisId]);

  const columns: TableProps<IPermohonanKredit>["columns"] = [
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
      title: "NAMA MARKETING",
      dataIndex: ["User", "fullname"],
      key: "marketing",
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
      title: "NO REKENING",
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
    },
    {
      title: "TUJUAN PENGGUNAAN",
      dataIndex: "purposeUse",
      key: "purposeUse",
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
      title: "FILE IDENTITAS",
      dataIndex: "fileIdentitas",
      key: "fileIdentitas",
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
            {record.Document.fileIdentitas &&
              (JSON.parse(record.Document.fileIdentitas) as IFileList[])
                .map((f) => f.name)
                .join(",")}
          </>
        );
      },
    },
    {
      title: "FILE KEPATUHAN",
      dataIndex: "fileKepatuhan",
      key: "fileKepatuhan",
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
            {record.Document.fileKepatuhan &&
              (JSON.parse(record.Document.fileKepatuhan) as IFileList[])
                .map((f) => f.name)
                .join(",")}
          </>
        );
      },
    },
    {
      title: "FILE MAUK",
      dataIndex: "fileMAUK",
      key: "fileMAUK",
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
            {record.Document.fileMAUK &&
              (JSON.parse(record.Document.fileMAUK) as IFileList[])
                .map((f) => f.name)
                .join(",")}
          </>
        );
      },
    },
    {
      title: "FILE SLIK",
      dataIndex: "fileSLIK",
      key: "fileSLIK",
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
            {record.Document.fileSLIK &&
              (JSON.parse(record.Document.fileSLIK) as IFileList[])
                .map((f) => f.name)
                .join(",")}
          </>
        );
      },
    },
    {
      title: "FILE ASPEK KEUANGAN",
      dataIndex: "fileAspekKKeuangan",
      key: "fileAspekKKeuangan",
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
            {record.Document.fileAspekKKeuangan &&
              (JSON.parse(record.Document.fileAspekKKeuangan) as IFileList[])
                .map((f) => f.name)
                .join(",")}
          </>
        );
      },
    },
    {
      title: "FILE JAMINAN",
      dataIndex: "fileJaminan",
      key: "fileJaminan",
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
            {record.Document.fileJaminan &&
              (JSON.parse(record.Document.fileJaminan) as IFileList[])
                .map((f) => f.name)
                .join(",")}
          </>
        );
      },
    },
    {
      title: "FILE KREDIT",
      dataIndex: "fileKredit",
      key: "fileKredit",
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
            {record.Document.fileKredit &&
              (JSON.parse(record.Document.fileKredit) as IFileList[])
                .map((f) => f.name)
                .join(",")}
          </>
        );
      },
    },
    {
      title: "LAST ACTIVITY",
      dataIndex: "lastactivity",
      key: "lastactivity",
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      children: [
        {
          title: "ACTIVITY",
          dataIndex: "activity",
          key: "activity",
          className: "text-xs",
          width: 300,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            const parse = record.activity
              ? (JSON.parse(record.activity) as EditActivity[])
              : [];
            return (
              <>
                <Paragraph
                  ellipsis={{
                    rows: 2,
                    expandable: "collapsible",
                  }}
                  style={{ fontSize: 11 }}
                >
                  {parse.map((p) => (
                    <>
                      {"{"}
                      {p.time} | {p.desc}
                      {"};"} <br />
                      <br />
                    </>
                  ))}
                </Paragraph>
              </>
            );
          },
        },
        {
          title: "EXPORT",
          dataIndex: "export",
          key: "export",
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
            const parse = record.activity
              ? (JSON.parse(record.activity) as EditActivity[])
              : [];
            const columns: IExcelColumn[] = [
              { header: "NAMA DEBITUR", key: "namaDebitur", width: 30 },
              { header: "NOMOR NIK", key: "nik", width: 30 },
              { header: "JENIS PEMOHON", key: "jenisPemohon", width: 30 },
              { header: "MARKETING", key: "marketing", width: 30 },
              { header: "CREATED_AT", key: "createdAt", width: 30 },
              ...(parse &&
                parse.map((p) => ({
                  header: "AKTIVITAS " + p.time,
                  key: p.time,
                  width: 50,
                }))),
            ];
            const rows = {
              namaDebitur: record.fullname,
              nik: record.NIK,
              jenisPemohon: record.JenisPemohon.name,
              marketing: record.User.fullname,
              createdAt: moment(record.createdAt).format("DD/MM/YYYY"),
            } as IExcelData;
            parse.forEach((p) => {
              rows[p.time] = p.desc; // misalnya "Edit field X"
            });
            return (
              <div className="flex justify-center">
                <ExportData
                  filename="LastActivities"
                  columns={columns}
                  rows={[rows]}
                />
              </div>
            );
          },
        },
      ],
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
            {hasAccess("detail") && <DetailPermohonan data={record} />}
            {hasAccess("update") && (
              <Link href={"/permohonan-kredit/" + record.id}>
                <Button
                  icon={<FormOutlined />}
                  size="small"
                  type="primary"
                  style={{ backgroundColor: "green" }}
                ></Button>
              </Link>
            )}
            {hasAccess("update") && (
              <Link href={"/permohonan-kredit/delete/" + record.id}>
                <Button
                  icon={<DeleteFilled />}
                  size="small"
                  type="primary"
                  danger
                ></Button>
              </Link>
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
