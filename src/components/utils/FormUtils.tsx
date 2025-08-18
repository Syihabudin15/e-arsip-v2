import {
  App,
  Button,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { IFileList, IFormInput } from "../IInterfaces";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { handleUnlock, isPdfProtected } from "./PDFUtils";
import { usePathname } from "next/navigation";
// const { Paragraph } = Typography;

export const FormInput = (params: IFormInput) => {
  return (
    <div
      className={`${params.hide ? "hidden" : "flex"} ${
        params.align && params.align === "col"
          ? "flex-col gap-1"
          : "flex-row gap-2 items-center my-1"
      } `}
      style={{ ...(params.width && { width: params.width }) }}
    >
      <div className={`w-46 flex`}>
        <div className="text-red-500 w-3">{params.required ? "*" : " "}</div>
        {params.label}
      </div>
      <div className="w-full">
        {params.type && params.type === "area" && (
          <Input.TextArea
            value={params.value}
            onChange={(e) => params.onChange && params.onChange(e.target.value)}
            disabled={params.disable}
          ></Input.TextArea>
        )}
        {params.type && params.type === "password" && (
          <Input.Password
            value={params.value}
            onChange={(e) => params.onChange && params.onChange(e.target.value)}
            disabled={params.disable}
          />
        )}
        {params.type && params.type === "option" && (
          <Select
            value={params.value}
            mode={params.optionsMode}
            onChange={(e) => params.onChange && params.onChange(e)}
            disabled={params.disable}
            options={params.options}
            placeholder="Choose"
            style={{ width: "100%" }}
            filterOption={(a, b) =>
              b?.label.toLowerCase().includes(a.toLowerCase())
            }
            showSearch
          />
        )}
        {!params.type && (
          <Input
            value={params.value}
            onChange={(e) => params.onChange && params.onChange(e.target.value)}
            disabled={params.disable}
          />
        )}
      </div>
    </div>
  );
};

export const FilterOption = ({
  items,
  value,
  onChange,
  width,
}: {
  items: { label: string; value: any }[];
  value: any;
  onChange?: Function;
  width: number;
}) => {
  return (
    <Select
      options={items}
      allowClear
      value={value}
      onChange={(e) => onChange && onChange(e)}
      placeholder={<span className="text-xs">Options</span>}
      size="small"
      style={{ width: width }}
    />
  );
};

export const FormUpload = ({
  value,
  label,
  setChange,
  hide,
  setActivity,
}: {
  value: string | null;
  label: string;
  setChange: Function;
  hide?: boolean;
  setActivity?: Function;
}) => {
  const [files, setFiles] = useState<IFileList[]>(
    value ? JSON.parse(value) : []
  );
  const pathname = usePathname();

  useEffect(() => {
    setChange(JSON.stringify(files));
  }, [files]);

  return (
    <div
      className={`${
        hide ? "hidden" : "flex"
      } justify-between my-1 items-center border-b border-gray-200 py-1`}
    >
      <div>{label}</div>
      <div className="w-[70%]">
        <div className="italic text-xs opacity-80 my-1">
          <FormUploadListFile
            files={files}
            setFiles={setFiles}
            label={label}
            setActivity={setActivity}
            pathname={pathname}
          />
        </div>

        <FormUploadInputFile
          setFiles={(newFile: IFileList) => setFiles([...files, newFile])}
          label={label}
          setActivity={setActivity}
        />
      </div>
    </div>
  );
};

const FormUploadListFile = ({
  files,
  setFiles,
  setActivity,
  label,
  pathname,
}: {
  files: IFileList[];
  setFiles: Function;
  setActivity?: Function;
  label: string;
  pathname: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteFiles = async (publicId: string) => {
    setLoading(true);
    await fetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ publicId: publicId, resourcetype: "raw" }),
    })
      .then(() => {
        const filterFiles = files.filter((f) => f.file !== publicId);
        setFiles(filterFiles);
      })
      .catch((err) => {
        console.log(err);
        alert("Error");
      });
    setLoading(false);
  };

  return (
    <div className="italic text-xs opacity-90">
      {files.map((f) => (
        <div className="flex gap-2 justify-end items-center" key={f.name}>
          <div className="w-[85%]">
            {/* <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            > */}
            ({f.name}){/* </Paragraph> */}
          </div>
          {pathname.includes("create") && (
            <Button
              icon={<DeleteOutlined />}
              size="small"
              type="primary"
              danger
              loading={loading}
              onClick={() => {
                handleDeleteFiles(f.file);
                if (setActivity) {
                  const txt = `Hapus ${label} (${f.name})`;
                  setActivity((prev: string[]) => {
                    prev = prev
                      ? prev.filter(
                          (p) => !p.includes(`Hapus ${label} (${f.name})`)
                        )
                      : [];
                    prev.push(txt);
                    return prev;
                  });
                }
              }}
            ></Button>
          )}
        </div>
      ))}
    </div>
  );
};

const FormUploadInputFile = ({
  setFiles,
  setActivity,
  label,
}: {
  setFiles: Function;
  setActivity?: Function;
  label: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currFiles, setCurrFiles] = useState<IFileList>({
    allowedDownload: "",
    name: "",
    file: "",
  });
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [filePass, setFilePass] = useState<string>();
  const [errMsg, setErrMsg] = useState<string>();
  const [loadingPass, setLoadingPass] = useState(false);
  const { notification } = App.useApp();

  const handleDeleteCurrFile = async () => {
    setLoading(true);
    await fetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ publicId: currFiles.file, resourcetype: "raw" }),
    })
      .then(() => {
        setCurrFiles({ ...currFiles, file: "", allowedDownload: "" });
        if (setActivity) {
          const txt = `Hapus ${label} (${currFiles.name})`;
          setActivity((prev: string[]) => {
            prev = prev
              ? prev.filter(
                  (p) => !p.includes(`Hapus ${label} (${currFiles.name})`)
                )
              : [];
            prev.push(txt);
            return prev;
          });
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error");
      });
    setLoading(false);
  };

  const handlePasswordSubmit = async () => {
    if (!tempFile)
      return notification.error({
        message: "Mohon upload file terlebih dahulu!",
      });
    setLoadingPass(true);
    const unclokFile = await handleUnlock(tempFile, filePass || "");
    if (!unclokFile.status) {
      notification.error({ message: unclokFile.msg });
      setErrMsg(unclokFile.msg);
    } else {
      setTempFile(unclokFile.file);
      await handleUpload();
      setOpen(false);
    }
    setLoadingPass(false);
  };

  const props: UploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);
      const protectedPdf = await isPdfProtected(file);
      if (protectedPdf.status) {
        setTempFile(file);
        setOpen(true);
      } else {
        await handleUpload(file);
      }
      setLoading(false);
      return false; // prevent automatic upload
    },
    showUploadList: false, // sembunyikan default list
    accept: "application/pdf",
  };

  const handleUpload = async (file?: any) => {
    const formData = new FormData();
    formData.append("file", file || (tempFile as Blob));
    formData.append("upload_preset", "ml_default");
    formData.append(
      "folder",
      `${process.env.NEXT_PUBLIC_APP_FOLDER || ""}/${label}`
    );
    formData.append("public_id", `${currFiles.name}_${Date.now()}`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.secure_url) {
      setCurrFiles({
        ...currFiles,
        file: data.secure_url,
        allowedDownload: "",
      });
    } else {
      notification.error({ message: data.error.message });
      if (open) setErrMsg(data.error.message);
    }
  };

  return (
    <div className="flex gap-2 items-center justify-end">
      <div className="flex gap-2 items-center">
        <Input
          value={currFiles.name}
          onChange={(e) => setCurrFiles({ ...currFiles, name: e.target.value })}
          size="small"
          suffix={
            <>
              {!currFiles.file ? (
                <Upload {...props}>
                  <Button
                    icon={<CloudUploadOutlined />}
                    size="small"
                    type="primary"
                    style={{ fontSize: 12 }}
                    disabled={!currFiles.name}
                    loading={loading}
                  >
                    Broswe
                  </Button>
                </Upload>
              ) : (
                <div>
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    type="primary"
                    danger
                    loading={loading}
                    onClick={() => handleDeleteCurrFile()}
                  ></Button>
                </div>
              )}
            </>
          }
        />
      </div>
      <Button
        icon={<PlusCircleOutlined />}
        size="small"
        type="primary"
        style={{ fontSize: 12 }}
        disabled={!currFiles.file}
        onClick={() => {
          setFiles(currFiles);
          if (setActivity) {
            const txt = `Upload ${label} (${currFiles.name})`;
            setActivity((prev: string[]) => {
              prev = prev
                ? prev.filter(
                    (p) => !p.includes(`Upload ${label} (${currFiles.name})`)
                  )
                : [];
              prev.push(txt);
              return prev;
            });
          }
          setCurrFiles({ name: "", file: "", allowedDownload: "" });
        }}
      >
        Add
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="File Terkunci"
        onOk={handlePasswordSubmit}
        okButtonProps={{ loading: loadingPass }}
        loading={loadingPass}
      >
        <div className="my-4 flex flex-col gap-4">
          <p>
            File ini dilindungi password. Masukkan password untuk melanjutkan.
          </p>
          <Input.Password
            value={filePass}
            onChange={(e) => setFilePass(e.target.value)}
            placeholder="Masukkan file password"
          />
          {errMsg && <p className="my-2 italic text-xs">{errMsg}</p>}
        </div>
      </Modal>
    </div>
  );
};

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // convert to base64
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
