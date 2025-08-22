"use client";

import { useUser } from "@/components/contexts/UserContext";
import { IMenu } from "@/components/IInterfaces";
import { menuItems } from "@/components/utils/LayoutUtil";
import { Role } from "@prisma/client";
import { App, Button, Checkbox, Input, Spin, Table, TableProps } from "antd";
import { useEffect, useState } from "react";

const defaultMenu = menuItems.map((m) => ({
  path: m.key,
  name: m.label,
  access: [],
}));

const defaultRole: Role = {
  id: 0,
  roleName: "",
  permission: "",
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function UpsertRole({ record }: { record?: Role }) {
  const [data, setData] = useState(record ? record : defaultRole);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<IMenu[]>(
    record ? MergeMenu(defaultMenu, JSON.parse(record.permission)) : defaultMenu
  );
  const { modal } = App.useApp();
  const user = useUser();

  useEffect(() => {
    const newMenu = menus
      .filter((m) => m.access.length !== 0)
      .map((m) => ({ path: m.path, access: m.access }));
    setData((prev: Role) => ({
      ...prev,
      permission: JSON.stringify(newMenu),
    }));
  }, [menus]);

  const handleSubmit = async () => {
    if (!data.roleName) {
      modal.error({
        title: "ERROR",
        content: "Mohon lengkapi data terlebih dahulu!",
      });
      return;
    }
    setLoading(true);
    await fetch("/api/role", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201 || res.status === 200) {
          modal.success({
            title: "BERHASIL",
            content: `Data berhasil ${record ? "di Update" : "ditambahkan"}!`,
          });
          await fetch("/api/sendEmail", {
            method: "POST",
            body: JSON.stringify({
              subject: `Update Data Role ${data.roleName}`,
              description: `${user?.fullname} Berhasil melakukan update pada data Role ${data.roleName}`,
            }),
          });
          window && window.location.replace("/roles");
          return;
        }
        modal.error({
          title: "ERROR",
          content: res.msg,
        });
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

  const columns: TableProps<IMenu>["columns"] = [
    {
      title: "Menu",
      dataIndex: "menu",
      key: "menu",
      width: 150,
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.name}</>;
      },
    },
    {
      title: "Pathname",
      dataIndex: "pathname",
      key: "pathname",
      width: 150,
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.path}</>;
      },
    },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
      width: 200,
      className: "text-xs",
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
            <Checkbox.Group
              options={[
                "read",
                "write",
                "update",
                "delete",
                "download",
                "detail",
              ]}
              value={record.access}
              onChange={(e) => {
                setMenus((prev: IMenu[]) => {
                  const filter = prev.map((p) => {
                    if (p.path === record.path) {
                      p.access = e;
                    }
                    return p;
                  });
                  return filter;
                });
              }}
            />
          </>
        );
      },
    },
  ];
  return (
    <Spin spinning={loading}>
      <div className="p-2">
        <h1 className="font-bold py-2 mb-8  text-lg border-b">
          {record ? "UPDATE" : "CREATE NEW"} ROLE
        </h1>
        <div className="flex gap-5 my-3 items-center">
          <p className="w-32">
            <span className="text-red-500">*</span>Nama Role
          </p>
          <Input
            required
            value={data.roleName}
            onChange={(e) =>
              setData((prev: Role) => ({ ...prev, roleName: e.target.value }))
            }
          />
        </div>
        <div className="my-2">
          <p>Role Permissions</p>
          <Table
            rowKey={"path"}
            columns={columns}
            dataSource={menus}
            size="small"
            pagination={false}
            scroll={{ x: "max-content", y: 370 }}
            loading={loading}
            bordered
          />
        </div>
        <div className="flex justify-end m-4 gap-4">
          <Button
            danger
            onClick={() => window && window.location.replace("/roles")}
            loading={loading}
          >
            Back
          </Button>
          <Button
            type="primary"
            onClick={() => handleSubmit()}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    </Spin>
  );
}

function MergeMenu(
  menuItems: IMenu[],
  data: { path: string; access: string[] }[]
) {
  const mergedMenu = menuItems.map((item) => {
    const found = data.find((r) => r.path === item.path);
    return {
      ...item,
      access: found ? found.access : [],
    };
  });
  return mergedMenu;
}
