"use client";

import {
  IDescription,
  IFileList,
  IPermohonanKredit,
} from "@/components/IInterfaces";
import { FilterOption, FormInput } from "@/components/utils/FormUtils";
import {
  DeleteOutlined,
  FolderOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { JenisPemohon } from "@prisma/client";
import { Button, Input, Modal, Table, TableProps, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useAccess } from "@/components/utils/PermissionUtil";
import { MyPDFViewer } from "@/components/utils/PDFUtils";

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
            {hasAccess("delete") && (
              <DeletePermohonan data={record} getData={getData} />
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
                <Button
                  icon={<PlusCircleOutlined />}
                  type="primary"
                  size="small"
                  onClick={() =>
                    window &&
                    window.location.replace("/permohonan-kredit/create")
                  }
                >
                  New
                </Button>
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
}: {
  data: IPermohonanKredit;
  getData: Function;
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
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          Modal.success({
            title: "BERHASIL",
            content: `Data ${data && data.fullname} berhasil dihapus`,
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
          <div className="w-full sm:flex-1/4 sm:border-l rounded">
            <Tabs
              items={[
                {
                  label: `Identitas`,
                  key: "identitas",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileIdentitas ? (
                        <div className="flex justify-center items-center">
                          Belum ada data diUpload
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileIdentitas || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `SLIK`,
                  key: "slik",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileSLIK ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileSLIK || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `Jaminan`,
                  key: "jaminan",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileJaminan ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileJaminan || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `Kredit`,
                  key: "kredit",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileKredit ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileKredit || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `Aspek Keuangan`,
                  key: "aspekKeuangan",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileAspekKKeuangan ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileAspekKKeuangan || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `MAUK`,
                  key: "mauk",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileMAUK ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileMAUK || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `Kepatuhan`,
                  key: "kepatuhan",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileKepatuhan ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileKepatuhan || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `Legal`,
                  key: "legal",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileLegal ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileLegal || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: `Custody`,
                  key: "custody",
                  children: (
                    <div className="h-[70vh]">
                      {!data.Document.fileCustody ? (
                        <div className="text-center italic">
                          Belum ada data diUpload!
                        </div>
                      ) : (
                        <BerkasBerkas
                          files={
                            JSON.parse(
                              data.Document.fileCustody || "[]"
                            ) as IFileList[]
                          }
                        />
                      )}
                    </div>
                  ),
                },
              ]}
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
            value={data.Document.accountNumber || ""}
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
      <div className="p-2 rounded bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-gray-50">
        <p>DATA MARKETING</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Marketing</div>
        <div>
          <Input
            disabled
            value={data.Document.User.fullname}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>Email</div>
        <div>
          <Input
            disabled
            value={data.Document.User.email}
            style={{ color: "GrayText" }}
          />
        </div>
      </div>
      <div className="p-2 rounded bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-gray-50">
        <p>KETERANGAN KETERANGAN</p>
      </div>
      {data.Document.description &&
        (JSON.parse(data.Document.description) as IDescription[]).map(
          (d: IDescription, i: number) => (
            <FormInput
              type="area"
              disable
              label={"Keterangan " + d.date}
              value={d.desc}
              onChange={(e: string) => {}}
              key={i}
            />
          )
        )}
    </div>
  );
};

const BerkasBerkas = ({ files }: { files: IFileList[] }) => {
  const { access, hasAccess } = useAccess("/permohonan-kredit");
  const [allFile, setAllFile] = useState<string>();

  useEffect(() => {
    (async () => {
      const result = await mergePDF(files.map((f) => f.file));
      if (!result) return;
      setAllFile(result);
    })();
  }, [files]);
  return (
    <div className="h-full">
      <Tabs
        size="small"
        type="card"
        tabBarStyle={{ width: 80 }}
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
                      download={hasAccess("download") ? true : false}
                    />
                  </div>
                )}
              </>
            ),
          },
          ...(files &&
            files.map((f) => ({
              label: f.name,
              key: f.name + Date.now(),
              children: (
                <div className="h-[70vh]">
                  <MyPDFViewer
                    fileUrl={f.file}
                    download={hasAccess("download") ? true : false}
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
