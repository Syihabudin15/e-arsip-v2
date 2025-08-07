import { useUser } from "@/components/contexts/UserContext";
import {
  EditActivity,
  IDescription,
  IPermohonanKredit,
} from "@/components/IInterfaces";
import { FormInput, FormUpload } from "@/components/utils/FormUtils";
import { JenisPemohon, User } from "@prisma/client";
import { App, Button, Select, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function CreatePermohonanKredit({
  record,
}: {
  record?: IPermohonanKredit;
}) {
  const [data, setData] = useState<IPermohonanKredit>(
    record || defaultPermohonan
  );
  const [jeniss, setJenis] = useState<JenisPemohon[]>([]);
  const [userss, setUserss] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempDesc, setTempDesc] = useState<string>();
  const [activity, setActivity] = useState<string[]>([]);
  const user = useUser();
  const { modal } = App.useApp();

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetch("/api/jenis-pemohon")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            setJenis(res.data.map((d: JenisPemohon) => ({ ...d, key: d.id })));
          }
        });
      await fetch("/api/user")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            setUserss(res.data.map((d: User) => ({ ...d, key: d.id })));
          }
        });
    })();
    setData({
      ...data,
      Document: {
        ...data.Document,
        userId:
          user && user.role.roleName === "MARKETING"
            ? user.id
            : data.Document.userId,
        User: user ? user : data.Document.User,
      },
    });
    setActivity([]);
    setTempDesc(undefined);
    setLoading(false);
  }, []);

  const handleSubmit = async () => {
    if (!data.JenisPemohon.name || !data.Document.User.fullname)
      return alert("Mohon lengkapi data terlebih dahulu");
    setLoading(true);
    if ("key" in data) {
      delete data.key;
    }
    if (tempDesc) {
      const temp = data.Document.description
        ? (JSON.parse(data.Document.description) as IDescription[])
        : [];
      temp.push({ date: moment().format("DD/MM/YYYY"), desc: tempDesc });
      data.Document.description = JSON.stringify(temp);
    }
    if (record && activity) {
      const temp = data.Document.activity
        ? (JSON.parse(data.Document.activity) as EditActivity[])
        : [];
      temp.push({
        time: moment().format("DD/MM/YYYY HH:mm"),
        desc: `${user?.fullname}: ${activity.join(",")}`,
      });
      data.Document.activity = JSON.stringify(temp);
    }
    await fetch("/api/permohonan", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201) {
          modal.success({
            title: "BERHASIL",
            content: `Data berhasil ${record ? "di Update" : "Ditambahkan"}`,
          });
        } else {
          modal.error({
            title: "ERROR",
            content: res.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        modal.error({
          title: "ERROR",
          content: "Internal Server Error",
        });
      });
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col sm:flex-row gap-5  p-1 items-start">
        <div className="flex-1 flex gap-2 justify-between flex-wrap">
          <div className="w-full bg-gradient-to-br from-purple-500 to-blue-500 text-gray-50 p-2 rounded font-bold">
            <p>DATA PEMOHON</p>
          </div>
          <FormInput
            label="Nama Pemohon"
            value={data.fullname}
            onChange={(e: string) => {
              setData({ ...data, fullname: e });
              if (record) {
                const txt = `Edit Nama Pemohon (${record.fullname} to ${e})`;
                setActivity((prev) => {
                  prev = prev
                    ? prev.filter((p) => !p.includes("Edit Nama Pemohon"))
                    : [];
                  prev.push(txt);
                  return prev;
                });
              }
            }}
            align="col"
            width={"48%"}
            required
          />
          <FormInput
            label="Nomor NIK"
            value={data.NIK}
            onChange={(e: string) => {
              setData({ ...data, NIK: e });
              if (record) {
                const txt = `Edit NIK (${record.NIK} to ${e})`;
                setActivity((prev) => {
                  prev = prev
                    ? prev.filter((p) => !p.includes("Edit NIK"))
                    : [];
                  prev.push(txt);
                  return prev;
                });
              }
            }}
            align="col"
            width={"48%"}
          />
          <FormInput
            label="Nomor Rekening"
            value={data.Document.accountNumber}
            onChange={(e: string) => {
              setData({
                ...data,
                Document: { ...data.Document, accountNumber: e },
              });
              if (record) {
                const txt = `Edit No Rekening (${record.Document.accountNumber} to ${e})`;
                setActivity((prev) => {
                  prev = prev
                    ? prev.filter((p) => !p.includes("Edit No Rekening"))
                    : [];
                  prev.push(txt);
                  return prev;
                });
              }
            }}
            align="col"
            width={"48%"}
            hide={user && user.role.roleName === "MARKETING" ? true : false}
          />
          <div style={{ width: "48%" }}>
            <div className="p-1">
              <span className="text-red-500 w-3">*</span> Jenis Pemohon
            </div>
            <Select
              options={jeniss.map((j) => ({ label: j.name, value: j.id }))}
              value={data.jenisPemohonId || undefined}
              style={{ width: "100%" }}
              onChange={(e) => {
                setData({
                  ...data,
                  jenisPemohonId: e,
                  JenisPemohon: jeniss.filter((j) => j.id === e)[0],
                });
                if (record) {
                  const txt = `Edit Jenis Pemohon (${record.jenisPemohonId} to ${e})`;
                  setActivity((prev) => {
                    prev = prev
                      ? prev.filter((p) => !p.includes("Edit Jenis Pemohon"))
                      : [];
                    prev.push(txt);
                    return prev;
                  });
                }
              }}
            />
          </div>
          <div style={{ width: "48%" }}>
            <div className="p-1">
              <span className="text-red-500 w-3">*</span> Marketing
            </div>
            <Select
              options={userss.map((u) => ({ label: u.fullname, value: u.id }))}
              style={{ width: "100%" }}
              value={data.Document.userId || undefined}
              disabled={user && user.role.roleName === "MARKETING"}
              onChange={(e) => {
                setData({
                  ...data,
                  Document: {
                    ...data.Document,
                    userId: e,
                    User: userss.filter((u) => u.id === e)[0],
                  },
                });
                if (record) {
                  const txt = `Edit Marketing (${record.Document.userId} to ${e})`;
                  setActivity((prev) => {
                    prev = prev
                      ? prev.filter((p) => !p.includes("Edit Marketing"))
                      : [];
                    prev.push(txt);
                    return prev;
                  });
                }
              }}
            />
          </div>
          {user && user.role.roleName !== "MARKETING" && (
            <>
              <div className="w-full bg-gradient-to-br from-purple-500 to-blue-500 text-gray-50 p-2 rounded font-bold">
                <p>KETERANGAN</p>
              </div>
              {data.Document.description &&
                (JSON.parse(data.Document.description) as IDescription[]).map(
                  (d: IDescription, i: number) => (
                    <FormInput
                      type="area"
                      label={"Keterangan " + d.date}
                      disable
                      value={d.desc}
                      onChange={(e: string) => {}}
                      align="col"
                      width={"48%"}
                      key={i}
                    />
                  )
                )}
              <FormInput
                type="area"
                label="Keterangan"
                value={tempDesc}
                onChange={(e: string) => {
                  setTempDesc(e);
                  if (record) {
                    const txt = `Tambah Keterangan (${e})`;
                    setActivity((prev) => {
                      prev = prev
                        ? prev.filter((p) => !p.includes("Tambah Keterangan"))
                        : [];
                      prev.push(txt);
                      return prev;
                    });
                  }
                }}
                align="col"
                width={"48%"}
              />
            </>
          )}
        </div>
        <div className="flex-1">
          <div className="w-full bg-gradient-to-br from-purple-500 to-green-500 text-gray-50 p-2 rounded font-bold">
            <p>BERKAS - BERKAS</p>
          </div>
          <div>
            <FormUpload
              label="File Identitas"
              value={data.Document.fileIdentitas}
              setChange={(e: string) =>
                setData({
                  ...data,
                  Document: {
                    ...data.Document,
                    fileIdentitas: e,
                  },
                })
              }
              setActivity={record && setActivity}
            />
            {user && user.role.roleName !== "MARKETING" && (
              <>
                <FormUpload
                  label="File Kepatuhan"
                  value={data.Document.fileKepatuhan}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileKepatuhan: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
                <FormUpload
                  label="File MAUK"
                  value={data.Document.fileMAUK}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileMAUK: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
                <FormUpload
                  label="File Aspek Keuangan"
                  value={data.Document.fileAspekKKeuangan}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileAspekKKeuangan: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
                <FormUpload
                  label="File SLIK"
                  value={data.Document.fileSLIK}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileSLIK: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
                <FormUpload
                  label="File Jaminan"
                  value={data.Document.fileJaminan}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileJaminan: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
                <FormUpload
                  label="File Kredit"
                  value={data.Document.fileKredit}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileKredit: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
                <FormUpload
                  label="File Legal"
                  value={data.Document.fileLegal}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileLegal: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
                <FormUpload
                  label="File Custody"
                  value={data.Document.fileCustody}
                  setChange={(e: string) =>
                    setData({
                      ...data,
                      Document: {
                        ...data.Document,
                        fileCustody: e,
                      },
                    })
                  }
                  setActivity={record && setActivity}
                />
              </>
            )}
          </div>
          <div className="flex justify-end mt-5 mb-2 gap-4">
            <Button
              loading={loading}
              onClick={() =>
                window &&
                window.location.replace(
                  record ? "/document" : "/permohonan-kredit"
                )
              }
              danger
            >
              Back
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Spin>
  );
}

const defaultPermohonan: IPermohonanKredit = {
  id: 0,
  fullname: "",
  NIK: "",

  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  jenisPemohonId: 0,
  documentId: 0,
  JenisPemohon: {
    id: 0,
    name: "",
    keterangan: "",

    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Document: {
    id: 0,
    fullname: "",
    accountNumber: "",
    description: "",
    fileIdentitas: "",
    fileSLIK: "",
    fileJaminan: "",
    fileKredit: "",
    fileAspekKKeuangan: "",
    fileMAUK: "",
    fileKepatuhan: "",
    fileLegal: "",
    fileCustody: "",

    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 0,
    activity: null,
    User: {
      id: 0,
      fullname: "",
      username: "",
      password: "",
      email: "",
      photo: "",

      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: 0,
    },
  },
};
