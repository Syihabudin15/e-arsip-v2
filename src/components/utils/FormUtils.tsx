import { Button, Input, Select, Typography, Upload, UploadProps } from "antd";
import { IFileList, IFormInput } from "../IInterfaces";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export const FormInput = (params: IFormInput) => {
  return (
    <div
      className={`flex ${
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
            onChange={(e) => params.onChange && params.onChange(e)}
            disabled={params.disable}
            options={params.options}
            placeholder="Choose"
            style={{ width: "100%" }}
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
}: {
  value: string | null;
  label: string;
  setChange: Function;
}) => {
  const [files, setFiles] = useState<IFileList[]>(
    value ? JSON.parse(value) : []
  );

  useEffect(() => {
    setChange(JSON.stringify(files));
  }, [files]);

  return (
    <div className="flex justify-between my-2 items-center border-b border-gray-200 py-1">
      <div>{label}</div>
      <div className="w-[70%]">
        <div className="italic text-xs opacity-80 my-2">
          <FormUploadListFile files={files} setFiles={setFiles} />
        </div>
        <FormUploadInputFile
          setFiles={(newFile: IFileList) => setFiles([...files, newFile])}
        />
      </div>
    </div>
  );
};

const FormUploadListFile = ({
  files,
  setFiles,
}: {
  files: IFileList[];
  setFiles: Function;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteFiles = (publicId: string) => {
    setLoading(true);
    fetch("/api/upload", {
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
    <div className="italic text-xs opacity-80 my-2">
      {files.map((f) => (
        <div className="flex gap-2 justify-end items-center" key={f.name}>
          <div className="w-[80%]">
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              ({f.name}) {f.file}
            </Paragraph>
          </div>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            type="primary"
            danger
            loading={loading}
            onClick={() => handleDeleteFiles(f.file)}
          ></Button>
        </div>
      ))}
    </div>
  );
};

const FormUploadInputFile = ({ setFiles }: { setFiles: Function }) => {
  const [loading, setLoading] = useState(false);
  const [currFiles, setCurrFiles] = useState<IFileList>({
    name: "",
    file: "",
  });

  const handleDeleteCurrFile = () => {
    setLoading(true);
    fetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ publicId: currFiles.file, resourcetype: "raw" }),
    })
      .then(() => {
        setCurrFiles({ ...currFiles, file: "" });
      })
      .catch((err) => {
        console.log(err);
        alert("Error");
      });
    setLoading(false);
  };

  const props: UploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);
      try {
        const temp = await getBase64(file);
        const base64 = temp.split(",")[1];
        await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            file: base64,
            folder: "sip2025",
            resourcetype: "auto",
            fileType: "application/pdf",
            publicId: Date.now(),
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.status === 200) {
              setCurrFiles({ ...currFiles, file: res.data });
            } else {
              alert("Upload Failed!");
            }
          })
          .catch((err) => {
            console.log(err);
            alert("Upload failed!");
          });
      } catch (err) {
        alert("Failed to convert file to base64");
      }
      setLoading(false);
      return false; // prevent automatic upload
    },
    showUploadList: false, // sembunyikan default list
    accept: "application/pdf",
  };

  return (
    <div className="flex gap-2 items-center justify-end">
      <div className="flex gap-2">
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
          setCurrFiles({ name: "", file: "" });
        }}
      >
        Add
      </Button>
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
