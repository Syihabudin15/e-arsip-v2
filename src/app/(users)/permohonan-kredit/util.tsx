"use client";

import {
  EditActivity,
  IDescription,
  IPermohonan,
  IRootFiles,
  IUser,
} from "@/components/IInterfaces";
import { FilterOption, FormInput } from "@/components/utils/FormUtils";
import {
  DeleteOutlined,
  FolderOutlined,
  FormOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { EProdukType, JenisPemohon, Produk } from "@prisma/client";
import {
  App,
  Button,
  Input,
  Modal,
  Table,
  TableProps,
  Tabs,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useAccess } from "@/components/utils/PermissionUtil";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUser } from "@/components/contexts/UserContext";
import { usePathname } from "next/navigation";
import { HandleFileViewer } from "@/components/utils/LayoutUtil";
const MyPDFViewer = dynamic(
  () => import("@/components/utils/LayoutUtil").then((d) => d.MyPDFViewer),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const { Paragraph } = Typography;

export default function TablePermohonanKredit({ type }: { type: EProdukType }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [jenisId, setJenisId] = useState<number>();
  const [produkId, setProdukId] = useState<number>();
  const [data, setData] = useState<IPermohonan[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jeniss, setJeniss] = useState<JenisPemohon[]>([]);
  const pathname = usePathname();
  const { hasAccess } = useAccess(pathname);
  const user = useUser();
  const [produks, setProduks] = useState<Produk[]>([]);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/permohonan?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }${jenisId ? "&jenisId=" + jenisId : ""}&produkType=${type}${
        produkId ? "&produkId=" + produkId : ""
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
      await fetch("/api/jenis-pemohon")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200)
            setJeniss(res.data.map((d: JenisPemohon) => ({ ...d, key: d.id })));
        });
      await fetch("/api/produk?produkType=" + type)
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) setProduks(res.data);
        });
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page, pageSize, jenisId, produkId]);

  const columns: TableProps<IPermohonan>["columns"] = [
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
      title: "NO CIF",
      dataIndex: ["Pemohon", "accountNumber"],
      key: "accountNumber",
      width: 100,
      className: "text-xs text-center",
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
      title: "NAMA PEMOHON",
      dataIndex: ["Pemohon", "fullname"],
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
      dataIndex: ["Pemohon", "NIK"],
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
      title: "PRODUK",
      dataIndex: ["Produk", "name"],
      key: "produk",
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
      title: "JENIS PEMOHON",
      dataIndex: ["Pemohon", "JenisPemohon", "name"],
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
      title: "LAST ACTIVITY",
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
      title: "BERKAS BERKAS",
      dataIndex: "files",
      key: "files",
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
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: "collapsible",
              }}
              style={{ fontSize: 11 }}
            >
              {record.RootFiles.filter((rf) => rf.Files.length !== 0).map(
                (rf) => (
                  <>
                    {"{"}
                    {rf.name} : [{rf.Files.map((f) => f.name).join(", ")}]{"};"}{" "}
                    <br />
                  </>
                )
              )}
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
            {hasAccess("detail") && (
              <DetailPermohonan data={record} hasAccess={hasAccess} />
            )}
            {user && (
              <>
                {hasAccess("delete") && (
                  <Button
                    onClick={() =>
                      window &&
                      window.location.replace(
                        `/permohonan-${type.toLowerCase()}/delete/` + record.id
                      )
                    }
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                  ></Button>
                )}
                {hasAccess("update") && (
                  <Button
                    onClick={() =>
                      window &&
                      window.location.replace(
                        `/permohonan-${type.toLowerCase()}/` + record.id
                      )
                    }
                    icon={<FormOutlined />}
                    type="primary"
                    size="small"
                  ></Button>
                )}
                {hasAccess("delete") && (
                  <DeletePermohonan
                    data={record}
                    getData={getData}
                    user={user}
                  />
                )}
              </>
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
            <h1 className="font-bold text-xl">DATA {type}</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between overflow-auto">
            <div className="flex gap-2">
              {hasAccess("write") && (
                <Link href={`/permohonan-${type.toLocaleLowerCase()}/create`}>
                  <Button
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    size="small"
                  >
                    New
                  </Button>
                </Link>
              )}
              <FilterOption
                items={jeniss.map((j) => ({ label: j.name, value: j.id }))}
                value={jenisId}
                onChange={(e: number) => setJenisId(e)}
                width={150}
              />
              <FilterOption
                items={produks.map((j) => ({ label: j.name, value: j.id }))}
                value={produkId}
                onChange={(e: number) => setProdukId(e)}
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
    />
  );
}

export const DeletePermohonan = ({
  data,
  getData,
  user,
}: {
  data: IPermohonan;
  getData: Function;
  user: IUser;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();

  const handleSubmit = async () => {
    setLoading(true);
    if ("key" in data) {
      delete data.key;
    }
    await fetch("/api/permohonan", {
      method: "DELETE",
      body: JSON.stringify({
        id: data.id,
        status: false,
        updatedAt: new Date(),
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201 || res.status === 200) {
          modal.success({
            title: "BERHASIL",
            content: `Data ${data && data.Pemohon.fullname} berhasil dihapus`,
          });
          setOpen(false);
          getData();
          await fetch("/api/sendEmail", {
            method: "POST",
            body: JSON.stringify({
              subject: `Permohonan ${data.Pemohon.fullname} Dihapus`,
              description: `${user?.fullname} Berhasil menghapus data Permohonan  ${data.Pemohon.fullname}`,
            }),
          });
          return;
        }
        modal.error({ title: "ERROR", content: res.msg });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        modal.error({ title: "ERROR", content: "Internal Server Error" });
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
        title={`HAPUS PERMOHONAN ${data.Pemohon.fullname.toUpperCase()}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => handleSubmit()}
        loading={loading}
        okButtonProps={{ loading: loading }}
      >
        <div className="my-4">
          <p>Apakah anda yakin ingin menghapus Permohonan Kredit ini?</p>
        </div>
      </Modal>
    </div>
  );
};

export const DetailPermohonan = ({
  data,
  hasAccess,
}: {
  data: IPermohonan;
  hasAccess: Function;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        icon={<FolderOutlined />}
        type="primary"
        size="small"
        onClick={() => setOpen(true)}
      ></Button>
      <Modal
        title={`DETAIL ${data.Pemohon.fullname}`}
        open={open}
        footer={[]}
        onCancel={() => setOpen(false)}
        width={window && window.innerWidth > 600 ? "90vw" : "98vw"}
        style={{ top: 20 }}
      >
        <div className="flex flex-wrap gap-2 h-[80vh] overflow-y-scroll">
          <div className="w-full sm:flex-1 h-full overflow-auto">
            <DataPemohon data={data} />
          </div>
          <div className="w-full sm:flex-1/3 overflow-auto sm:border-l rounded">
            <Tabs
              items={data.RootFiles.map((d) => ({
                label: d.name,
                key: d.id.toString(),
                children: (
                  <div className="h-[70vh]">
                    {d.Files.length === 0 ? (
                      <div className="flex justify-center items-center">
                        Belum ada data diUpload
                      </div>
                    ) : (
                      <BerkasBerkas files={d} hasAccess={hasAccess} />
                    )}
                  </div>
                ),
              }))}
              type="card"
              className="h-full"
              size="small"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const DataPemohon = ({ data }: { data: IPermohonan }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="p-2 rounded bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-gray-50">
        <p>DATA PEMOHON</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>ID Permohonan</div>
        <div>
          <Input disabled value={data.id} style={{ color: "GrayText" }} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Nama Permohonan</div>
        <div>
          <Input
            disabled
            value={data.Pemohon.fullname}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>NIK Permohonan</div>
        <div>
          <Input
            disabled
            value={data.Pemohon.NIK || ""}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>NO CIF</div>
        <div>
          <Input
            disabled
            value={data.Pemohon.accountNumber || ""}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Jenis Pemohon</div>
        <div>
          <Input
            disabled
            value={data.Pemohon.JenisPemohon.name}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Tujuan Penggunaan</div>
        <div>
          <Input
            disabled
            value={data.purposeUse || ""}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="p-2 rounded bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-gray-50">
        <p>DATA MARKETING</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Marketing</div>
        <div>
          <Input
            disabled
            value={data.User.fullname}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Email</div>
        <div>
          <Input
            disabled
            value={data.User.email}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="p-2 rounded bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-gray-50">
        <p>KETERANGAN KETERANGAN</p>
      </div>
      {data.description &&
        (JSON.parse(data.description) as IDescription[]).map(
          (d: IDescription, i: number) => (
            <FormInput
              type="area"
              disable
              label={`${d.user} (${d.time})`}
              value={d.desc}
              onChange={() => {}}
              key={i}
            />
          )
        )}
    </div>
  );
};

const BerkasBerkas = ({
  files,
  hasAccess,
}: {
  files: IRootFiles;
  hasAccess: Function;
}) => {
  const user = useUser();
  const [allFile, setAllFile] = useState<string>();

  useEffect(() => {
    (async () => {
      const result = await mergePDF(
        files.Files.filter(
          (f) => f.RootFiles.resourceType === "application/pdf"
        ).map((f) => f.url)
      );
      if (!result) return;
      setAllFile(result);
    })();
  }, [files]);
  return (
    <div className="h-full">
      <Tabs
        size="small"
        type="card"
        tabBarStyle={{
          ...(window && window.innerWidth > 600 && { width: 80 }),
        }}
        items={[
          ...(files.resourceType === "application/pdf"
            ? [
                {
                  label: `Semua`,
                  key: "allFile",
                  children: (
                    <>
                      {allFile && (
                        <div className="h-[70vh]">
                          <MyPDFViewer
                            fileUrl={allFile}
                            download={hasAccess("download")}
                          />
                        </div>
                      )}
                    </>
                  ),
                },
              ]
            : []),
          ...(files &&
            files.Files.map((f) => ({
              label: f.name,
              key: f.url,
              children: (
                <HandleFileViewer
                  files={f.url}
                  resourceType={f.RootFiles.resourceType}
                  hasAccess={hasAccess}
                  user={user}
                  allowDownload={f.allowDownload}
                />
                // <div className="h-[70vh]">
                //   <MyPDFViewer
                //     fileUrl={f.url}
                //     download={(() => {
                //       const filter = f.allowDownload
                //         .split(",")
                //         .map(Number)
                //         .includes(user?.id || 0);
                //       if (hasAccess("download") || filter) {
                //         return true;
                //       }
                //       if (!f.allowDownload) return false;
                //       return false;
                //     })()}
                //   />
                // </div>
              ),
            }))),
        ]}
        tabPosition={window && window.innerWidth > 600 ? "left" : "top"}
      />
    </div>
  );
};

async function fetchPDF(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status}`);
  return await res.arrayBuffer();
}
export const mergePDF = async (links: any[]) => {
  const mapping = links.filter((l) => l && l.trim() !== "");
  if (mapping.length === 0) return null;
  const mergedPdf = await PDFDocument.create();
  for (const url of mapping) {
    try {
      const pdfBytes = await fetchPDF(url);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    } catch (err) {
      console.warn(`Skip file ${url}, bukan PDF valid`, err);
    }
  }

  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });
  const mergedUrl = URL.createObjectURL(blob);
  return mergedUrl;
};
