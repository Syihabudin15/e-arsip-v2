"use client";

import { FormInput } from "@/components/utils/FormUtils";
import {
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Role, User } from "@prisma/client";
import { App, Button, Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

interface IUser extends User {
  role: Role;
}

export default function TableUser() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [data, setData] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/user?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: IUser) => ({ ...d, key: d.id })));
        setTotal(res.total);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetch("/api/role")
        .then((res) => res.json())
        .then((res) => {
          setRoles(res.data.map((r: Role) => ({ ...r, key: r.id })));
        });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getData();
    })();
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page, pageSize]);

  const columns: TableProps<IUser>["columns"] = [
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
      title: "ROLE NAME",
      dataIndex: "roleName",
      key: "roleName",
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
        return <>{record.role.roleName}</>;
      },
    },
    {
      title: "NAMA LENGKAP",
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
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
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
        return <>{record.email}</>;
      },
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
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
        return <>{record.username}</>;
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
            <DeleteUser data={record} getData={getData} />
            <UpsertUser data={record} getData={getData} role={roles} />
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
            <h1 className="font-bold text-xl">User Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div className="flex gap-2">
              <UpsertUser getData={getData} role={roles} />
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
      columns={columns}
      rowKey={"id"}
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

const DeleteUser = ({ data, getData }: { data: IUser; getData: Function }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();

  const handleSubmit = async () => {
    setLoading(true);
    if ("key" in data) {
      delete data.key;
    }
    await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify({ ...data, status: false, updatedAt: new Date() }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          modal.success({
            title: "BERHASIL",
            content: `Data berhasil dihapus`,
          });
          getData();
          setOpen(false);
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
        type="primary"
        danger
        onClick={() => setOpen(true)}
        size="small"
      ></Button>
      <Modal
        title={`HAPUS ${data.fullname}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => handleSubmit()}
        loading={loading}
        okButtonProps={{ loading: loading }}
      >
        <div className="my-4">
          <p>Apakah anda yakin ingin menghapus Akun ini?</p>
        </div>
      </Modal>
    </div>
  );
};

const UpsertUser = ({
  data,
  getData,
  role,
}: {
  data?: User;
  getData: Function;
  role: Role[];
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState<User>(data || defaultUser);
  const { modal } = App.useApp();

  const handleSubmit = async () => {
    setLoading(true);
    if ("key" in tempData) {
      delete tempData.key;
    }
    await fetch("/api/user", {
      method: data ? "PUT" : "POST",
      body: JSON.stringify({
        ...tempData,
        username: tempData.username.toLowerCase(),
        updatedAt: new Date(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          modal.success({
            title: "BERHASIL",
            content: `Data berhasil ${data ? "di Update" : "Ditambahkan"}`,
          });
          getData();
          setOpen(false);
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
        icon={data ? <FormOutlined /> : <PlusCircleOutlined />}
        type="primary"
        onClick={() => setOpen(true)}
        size="small"
      >
        {!data && "New"}
      </Button>
      <Modal
        title={`${data ? "UPDATE " + data.fullname : "CREATE USER"}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => handleSubmit()}
        loading={loading}
        okButtonProps={{
          loading: loading,
          disabled:
            !tempData.fullname ||
            !tempData.username ||
            !tempData.email ||
            !tempData.roleId ||
            !tempData.password,
        }}
      >
        <div className="my-4 flex flex-col gap-1">
          <FormInput
            label="Nama Lengkap"
            required
            value={tempData.fullname}
            onChange={(e: string) =>
              setTempData((prev: User) => ({ ...prev, fullname: e }))
            }
          />
          <FormInput
            label="Username"
            required
            value={tempData.username}
            onChange={(e: string) =>
              setTempData((prev: User) => ({ ...prev, username: e }))
            }
          />
          <FormInput
            label="Email"
            required
            value={tempData.email}
            onChange={(e: string) =>
              setTempData((prev: User) => ({ ...prev, email: e }))
            }
          />
          {!data && (
            <FormInput
              label="Password"
              required
              type="password"
              value={tempData.password}
              onChange={(e: string) =>
                setTempData((prev: User) => ({ ...prev, password: e }))
              }
            />
          )}
          <FormInput
            label="Role"
            required
            type="option"
            options={role.map((r) => ({ label: r.roleName, value: r.id }))}
            value={tempData.roleId}
            onChange={(e: any) =>
              setTempData((prev: User) => ({ ...prev, roleId: e }))
            }
          />
        </div>
      </Modal>
    </div>
  );
};

const defaultUser: User = {
  id: 0,
  fullname: "",
  email: "",
  username: "",
  password: "",
  photo: null,
  roleId: 0,
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
