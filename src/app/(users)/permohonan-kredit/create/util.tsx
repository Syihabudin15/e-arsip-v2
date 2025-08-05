import { IDescription, IPermohonanKredit } from "@/components/IInterfaces";
import { FormInput, FormUpload } from "@/components/utils/FormUtils";
import { JenisPemohon, User } from "@prisma/client";
import { Button, Modal, Select, Spin } from "antd";
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

  useEffect(() => {
    setLoading(true);
    fetch("/api/jenis-pemohon")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setJenis(res.data.map((d: JenisPemohon) => ({ ...d, key: d.id })));
        }
      });
    fetch("/api/user")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setUserss(res.data.map((d: User) => ({ ...d, key: d.id })));
        }
      });
    setLoading(false);
  }, []);

  const handleSubmit = () => {
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
    fetch("/api/permohonan", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201) {
          Modal.success({
            title: "BERHASIL",
            content: `Data berhasil ${record ? "di Update" : "Ditambahkan"}`,
          });
        } else {
          Modal.error({
            title: "ERROR",
            content: res.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Modal.error({
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
            onChange={(e: string) => setData({ ...data, fullname: e })}
            align="col"
            width={"48%"}
            required
          />
          <FormInput
            label="Nomor NIK"
            value={data.NIK}
            onChange={(e: string) => setData({ ...data, NIK: e })}
            align="col"
            width={"48%"}
          />
          <FormInput
            label="Nomor Rekening"
            value={data.Document.accountNumber}
            onChange={(e: string) =>
              setData({
                ...data,
                Document: { ...data.Document, accountNumber: e },
              })
            }
            align="col"
            width={"48%"}
          />
          <div style={{ width: "48%" }}>
            <div className="p-1">
              <span className="text-red-500 w-3">*</span> Jenis Pemohon
            </div>
            <Select
              options={jeniss.map((j) => ({ label: j.name, value: j.id }))}
              value={data.jenisPemohonId}
              style={{ width: "100%" }}
              onChange={(e) =>
                setData({
                  ...data,
                  jenisPemohonId: e,
                  JenisPemohon: jeniss.filter((j) => j.id === e)[0],
                })
              }
            />
          </div>
          <div style={{ width: "48%" }}>
            <div className="p-1">
              <span className="text-red-500 w-3">*</span> Marketing
            </div>
            <Select
              options={userss.map((u) => ({ label: u.fullname, value: u.id }))}
              style={{ width: "100%" }}
              value={data.Document.userId}
              onChange={(e) =>
                setData({
                  ...data,
                  Document: {
                    ...data.Document,
                    userId: e,
                    User: userss.filter((u) => u.id === e)[0],
                  },
                })
              }
            />
          </div>
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
            onChange={(e: string) => setTempDesc(e)}
            align="col"
            width={"48%"}
          />
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
            />
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
            />
          </div>
          <div className="flex justify-end mt-5 mb-2 gap-4">
            <Button
              loading={loading}
              onClick={() =>
                window && window.location.replace("/permohonan-kredit")
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
