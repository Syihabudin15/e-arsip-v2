"use client";

import { useEffect, useState } from "react";
import { IFileList, IPermohonanKredit } from "@/components/IInterfaces";
import { FileOutlined, LoadingOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Modal, Spin } from "antd";
import { useUser } from "@/components/contexts/UserContext";
import moment from "moment";
import { FormInput } from "@/components/utils/FormUtils";
import { PermohonanAction } from "@prisma/client";
import { MyPDFViewer } from "@/components/utils/LayoutUtil";

export interface SelectedFIles {
  rootFilename: string;
  files: IFileList[];
}

export default function DeleteFiles({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IPermohonanKredit>();
  const [selected, setSelected] = useState<SelectedFIles[]>([
    { rootFilename: "FILE IDENTITAS", files: [] },
    { rootFilename: "FILE KEPATUHAN", files: [] },
    { rootFilename: "FILE MAUK", files: [] },
    { rootFilename: "FILE ASPEK KEUANGAN", files: [] },
    { rootFilename: "FILE SLIK", files: [] },
    { rootFilename: "FILE JAMINAN", files: [] },
    { rootFilename: "FILE KREDIT", files: [] },
    { rootFilename: "FILE LEGAL", files: [] },
    { rootFilename: "FILE CUSTODY", files: [] },
  ]);
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState<string>();
  const user = useUser();
  const { modal } = App.useApp();

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

  const handleSubmit = async () => {
    setLoading(true);
    const newdata = selected
      .filter((p) => p.files.length !== 0)
      .map((d) => ({
        rootFilename: d.rootFilename,
        files: JSON.stringify(d.files),
        statusAction: "PENDING",
        description: desc
          ? JSON.stringify([
              {
                name: user?.fullname,
                date: moment().format("DD/MM/YYYY"),
                desc: desc,
              },
            ])
          : null,
        action: "DELETE",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        requesterId: user?.id,
        approverId: null,
        documentId: data?.documentId,
      }));
    await fetch("/api/request", {
      method: "POST",
      body: JSON.stringify(newdata),
    })
      .then((res) => res.json())
      .then((res) => {
        modal.success({
          title: "BERHASIL",
          content: "Permohnan hapus berkas berhasil dikirimkan",
        });
        window && window.location.replace("/request/delete");
      })
      .catch((err) => {
        console.log(err);
        modal.error({ title: "ERROR", content: "Internal Server Error" });
      });
    setLoading(false);
  };

  if (!data) {
    return (
      <div>
        Memuat ... <LoadingOutlined />
      </div>
    );
  }
  return (
    <Spin spinning={loading}>
      <div className="p-2">
        <div className="text-lg py-4 font-bold border-b border-blue-500">
          <p>
            BERKAS BERKAS {data && data.fullname} ({data && data.NIK})
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-between">
          <Items
            label="FILE IDENTITAS"
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE IDENTITAS"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE IDENTITAS",
                files: [],
              };
            })()}
            setSelected={setSelected}
            files={
              JSON.parse(
                data.Document.fileIdentitas || "[]"
              ) as unknown as IFileList[]
            }
          />
          <Items
            label="FILE KEPATUHAN"
            files={
              JSON.parse(
                data.Document.fileKepatuhan || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE KEPATUHAN"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE KEPATUHAN",
                files: [],
              };
            })()}
            setSelected={setSelected}
          />
          <Items
            label="FILE MAUK"
            files={
              JSON.parse(
                data.Document.fileMAUK || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE MAUK"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE MAUK",
                files: [],
              };
            })()}
            setSelected={setSelected}
          />
          <Items
            label="FILE ASPEK KEUANGAN"
            files={
              JSON.parse(
                data.Document.fileAspekKKeuangan || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE ASPEK KEUANGAN"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE ASPEK KEUANGAN",
                files: [],
              };
            })()}
            setSelected={setSelected}
          />
          <Items
            label="FILE SLIK"
            files={
              JSON.parse(
                data.Document.fileSLIK || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE FILE SLIK"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE FILE SLIK",
                files: [],
              };
            })()}
            setSelected={setSelected}
          />
          <Items
            label="FILE JAMINAN"
            files={
              JSON.parse(
                data.Document.fileJaminan || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE JAMINAN"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE JAMINAN",
                files: [],
              };
            })()}
            setSelected={setSelected}
            request={(() => {
              const find = data.Document.PermohonanAction.filter(
                (f) => f.rootFilename === "FILE JAMINAN"
              );
              if (find.length === 0) return undefined;
              return find[0];
            })()}
          />
          <Items
            label="FILE KREDIT"
            files={
              JSON.parse(
                data.Document.fileKredit || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE KREDIT"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE KREDIT",
                files: [],
              };
            })()}
            setSelected={setSelected}
          />
          <Items
            label="FILE LEGAL"
            files={
              JSON.parse(
                data.Document.fileLegal || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE LEGAL"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE LEGAL",
                files: [],
              };
            })()}
            setSelected={setSelected}
          />
          <Items
            label="FILE CUSTODY"
            files={
              JSON.parse(
                data.Document.fileCustody || "[]"
              ) as unknown as IFileList[]
            }
            selected={(() => {
              const find = selected.filter(
                (s) => s.rootFilename === "FILE CUSTODY"
              );
              if (find.length !== 0) return find[0];

              return {
                rootFilename: "FILE CUSTODY",
                files: [],
              };
            })()}
            setSelected={setSelected}
          />
        </div>
        <div className="flex justify-end p-2">
          <Button type="primary" onClick={() => setOpen(true)}>
            Submit
          </Button>
        </div>
      </div>
      <Modal
        open={open}
        loading={loading}
        onCancel={() => setOpen(false)}
        title="KONFIRMASI PENGHAPUSAN BERKAS"
        okButtonProps={{
          loading: loading,
          onClick: () => handleSubmit(),
          disabled:
            selected.filter((s) => s.files.length !== 0).length === 0
              ? true
              : false,
        }}
      >
        <div className="my-4">
          {selected
            .filter((s) => s.files.length !== 0)
            .map((s) => (
              <div key={s.rootFilename} className="flex gap-4 items-center">
                <p className="font-bold w-42">{s.rootFilename}</p>
                <span>:</span>
                <div className="text-xs flex gap-2">
                  {s.files.map((f) => (
                    <div key={f.file}>{f.name},</div>
                  ))}
                </div>
              </div>
            ))}
          <div>
            <FormInput
              type="area"
              label="Keterangan"
              value={desc}
              onChange={(e: any) => setDesc(e)}
            />
          </div>
        </div>
      </Modal>
    </Spin>
  );
}

const Items = ({
  label,
  files,
  selected,
  setSelected,
  request,
}: {
  label: string;
  files: IFileList[];
  selected: SelectedFIles;
  setSelected: Function;
  request?: PermohonanAction;
}) => {
  const [tempSelected, setTempSelected] = useState<IFileList[]>(
    selected ? selected.files : []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelected((prev: SelectedFIles[]) =>
      prev.map((p) => {
        if (p.rootFilename === label) {
          p.files = tempSelected;
        }
        return p;
      })
    );
  }, [tempSelected]);

  return (
    <div className="w-full sm:w-[40vw] p-1 my-1">
      <div className="font-bold p-2 bg-gradient-to-br from-blue-500 to-green-500 text-gray-50 rounded">
        <p>{label}</p>
      </div>
      {files.map((file) => (
        <div key={file.file} className="border-b border-gray-200 p-1">
          <Checkbox
            checked={tempSelected.some((f) => f.file === file.file)}
            style={{ fontSize: 12 }}
            disabled={
              request &&
              (JSON.parse(request.files) as IFileList[]).filter(
                (req) => req.file === file.file
              ).length !== 0
                ? true
                : false
            }
            onChange={(e) => {
              if (e.target.checked) {
                setTempSelected([...tempSelected, file]);
              } else {
                setTempSelected(
                  tempSelected.filter((p) => p.file !== file.file)
                );
              }
            }}
          >
            <div className="flex justify-between items-center">
              <p className="w-42">
                {file.name}{" "}
                {request &&
                  (JSON.parse(request.files) as IFileList[]).filter(
                    (req) => req.file === file.file
                  ).length !== 0 &&
                  `(PENDING)`}
              </p>
              <Button
                icon={<FileOutlined />}
                size="small"
                onClick={() => setOpen(true)}
              ></Button>
            </div>
          </Checkbox>
          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            footer={[]}
            width={window && window.innerWidth > 600 ? "80vw" : "95vw"}
            style={{ top: 20 }}
            title={"BERKAS " + file.name}
          >
            <div className="h-[80vh]">
              <MyPDFViewer fileUrl={file.file} />
            </div>
          </Modal>
        </div>
      ))}
    </div>
  );
};
