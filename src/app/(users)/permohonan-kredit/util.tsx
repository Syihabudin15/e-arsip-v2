"use client";

import {
  IDescription,
  IPermohonanKredit,
  IRootFiles,
  IUser,
} from "@/components/IInterfaces";
import { FilterOption, FormInput } from "@/components/utils/FormUtils";
import {
  DeleteOutlined,
  FolderOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { JenisPemohon } from "@prisma/client";
import { Button, Input, Modal, Table, TableProps, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useAccess } from "@/components/utils/PermissionUtil";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUser } from "@/components/contexts/UserContext";
const MyPDFViewer = dynamic(
  () => import("@/components/utils/LayoutUtil").then((d) => d.MyPDFViewer),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function TablePermohonanKredit() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [jenisId, setJenisId] = useState<number>();
  const [data, setData] = useState<IPermohonanKredit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jeniss, setJeniss] = useState<JenisPemohon[]>([]);
  const { access, hasAccess } = useAccess("/permohonan-kredit");
  const user = useUser();

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
    const timeout = setTimeout(async () => {
      await getData();
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
      title: "ID",
      dataIndex: "id",
      key: "id",
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
        return <>{record.id}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
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
      render(value, record, index) {
        return <>{record.fullname}</>;
      },
    },
    {
      title: "NOMOR NIK",
      dataIndex: "nik",
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
      render(value, record, index) {
        return <>{record.NIK && record.NIK}</>;
      },
    },
    {
      title: "JENIS PEMOHON",
      dataIndex: "jenisPemohon",
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
      render(value, record, index) {
        return <>{record.JenisPemohon.name}</>;
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
            {user && (
              <>
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
            <h1 className="font-bold text-xl">Permohonan Kredit</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between overflow-auto">
            <div className="flex gap-2">
              {hasAccess("write") && (
                <Link href={"/permohonan-kredit/create"}>
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

const DeletePermohonan = ({
  data,
  getData,
  user,
}: {
  data: IPermohonanKredit;
  getData: Function;
  user: IUser;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if ("key" in data) {
      delete data.key;
    }
    await fetch("/api/permohonan", {
      method: "PUT",
      body: JSON.stringify({ ...data, status: false, updatedAt: new Date() }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201 || res.status === 200) {
          Modal.success({
            title: "BERHASIL",
            content: `Data ${data && data.fullname} berhasil dihapus`,
          });
          setOpen(false);
          getData();
          await fetch("/api/sendEmail", {
            method: "POST",
            body: JSON.stringify({
              subject: `Permohonan Kredit ${data.fullname} Dihapus`,
              description: `${user?.fullname} Berhasil menghapus data Permohonan Kredit ${data.fullname}`,
            }),
          });
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
        title={`HAPUS PERMOHONAN KREDIT ${data.fullname.toUpperCase()}`}
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

export const DetailPermohonan = ({ data }: { data: IPermohonanKredit }) => {
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
        title={`DETAIL ${data.fullname}`}
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
          <div className="w-full sm:flex-1 overflow-auto sm:border-l rounded">
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
                      <BerkasBerkas files={d} />
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

const DataPemohon = ({ data }: { data: IPermohonanKredit }) => {
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
          <Input disabled value={data.fullname} style={{ color: "GrayText" }} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>NIK Permohonan</div>
        <div>
          <Input
            disabled
            value={data.NIK || ""}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>NO Rekening</div>
        <div>
          <Input
            disabled
            value={data.accountNumber || ""}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Jenis Pemohon</div>
        <div>
          <Input
            disabled
            value={data.JenisPemohon.name}
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

const BerkasBerkas = ({ files }: { files: IRootFiles }) => {
  const { access, hasAccess } = useAccess("/permohonan-kredit");
  const user = useUser();
  const [allFile, setAllFile] = useState<string>();

  useEffect(() => {
    (async () => {
      const result = await mergePDF(files.Files.map((f) => f.url));
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
          ...(files &&
            files.Files.map((f) => ({
              label: f.name,
              key: f.name + Date.now(),
              children: (
                <div className="h-[70vh]">
                  <MyPDFViewer
                    fileUrl={f.url}
                    download={(() => {
                      const filter = f.allowDownload
                        .split(",")
                        .map(Number)
                        .includes(user?.id || 0);
                      if (hasAccess("download") || filter) {
                        return true;
                      }
                      if (!f.allowDownload) return false;
                      return false;
                    })()}
                  />
                </div>
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
