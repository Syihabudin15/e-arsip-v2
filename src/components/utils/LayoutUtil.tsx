"use client";

import {
  App,
  Button,
  Drawer,
  Dropdown,
  Image,
  Layout,
  Menu,
  Space,
} from "antd";
import {
  DashboardFilled,
  FileTextFilled,
  FolderFilled,
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";

export const UserBio = () => {
  const user = useUser();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  const showNotif = (msg: string) => {
    notification.error({
      message: "Error",
      description: msg,
      placement: "bottomRight",
    });
  };
  const handleLogout = () => {
    setLoading(true);
    fetch("/api/auth", { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== 200) {
          showNotif(res.msg);
          return;
        }
        window && window.location.replace("/");
      })
      .catch((err) => {
        console.log(err);
        showNotif("Internal Server Error");
      });
    setLoading(false);
  };

  return (
    <div className="hidden sm:block">
      {user && (
        <Dropdown
          menu={{
            items: [
              {
                key: "info",
                onClick: () => window && window.location.replace("/biodata"),
                label: (
                  <div>
                    <div className="flex gap-2 items-center">
                      <div>
                        <Image
                          src={
                            user && user.photo ? user.photo : "/rifi-logo.png"
                          }
                          width={30}
                          height={30}
                          alt="User Picture"
                        />
                      </div>
                      <div>
                        <div className="font-bold">
                          Hi! {user && user.fullname}
                        </div>
                        <div className="text-xs italic">
                          {user && user.role && user.role.roleName}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              { type: "divider" },
              {
                key: "logout",
                label: (
                  <div className="my-2 mx-1 flex justify-end">
                    <Button
                      size="small"
                      type="primary"
                      danger
                      onClick={() => handleLogout()}
                      loading={loading}
                    >
                      Logout
                    </Button>
                  </div>
                ),
              },
            ],
          }}
          placement="bottomRight"
        >
          <div className="text-gray-50">
            <Space style={{ cursor: "pointer", userSelect: "none" }}>
              <UserOutlined />
              <div>{user && user.fullname}</div>
            </Space>
          </div>
        </Dropdown>
      )}
    </div>
  );
};

export const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardFilled />,
    key: "/dashboard",
  },
  {
    label: "Jenis Pemohon",
    icon: <TeamOutlined />,
    key: "/jenis-pemohon",
  },
  {
    label: "Permohonan Kredit",
    icon: <FileTextFilled />,
    key: "/permohonan-kredit",
  },
  {
    label: "Dokumen",
    icon: <FolderFilled />,
    key: "/document",
  },
  {
    label: "User Management",
    icon: <UserOutlined />,
    key: "/users",
  },
  {
    label: "Role Management",
    icon: <KeyOutlined />,
    key: "/roles",
  },
];

export const MenuMobile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const { notification } = App.useApp();

  const showNotif = (msg: string) => {
    notification.error({
      message: "Error",
      description: msg,
      placement: "bottomRight",
    });
  };
  const handleLogout = () => {
    setLoading(true);
    fetch("/api/auth", { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== 200) {
          showNotif(res.msg);
          return;
        }
        window && window.location.replace("/");
      })
      .catch((err) => {
        console.log(err);
        showNotif("Internal Server Error");
      });
    setLoading(false);
  };

  return (
    <>
      {user && (
        <div className="block sm:hidden">
          <Button
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          ></Button>
        </div>
      )}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={"80vw"}
        title="Main Menu"
      >
        <div>
          <div className="flex gap-4 items-center border-b border-gray-200 py-3">
            <div>
              <Image
                src={user && user.photo ? user.photo : "/rifi-logo.png"}
                width={30}
                height={30}
                alt="User Picture"
              />
            </div>
            <div>
              <div className="font-bold">Hi! {user && user.fullname}</div>
              <div className="text-xs italic">
                {user && user.role && user.role.roleName}
              </div>
            </div>
          </div>
          <div>
            <Menu
              items={menuItems}
              onClick={(e) => window && window.location.replace(e.key)}
            />
          </div>
          <div className="my-2">
            <Button
              icon={<LogoutOutlined />}
              danger
              type="primary"
              block
              loading={loading}
              onClick={() => handleLogout()}
            >
              Logout
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};
export const MenuWindows = () => {
  const [collapse, setCollapse] = useState(false);
  return (
    <div className="hidden sm:block h-[92vh] bg-blue-500">
      <Layout>
        <Button
          onClick={() => setCollapse(!collapse)}
          type="primary"
          style={{ borderRadius: 0, background: "#3B82F6" }}
        >
          {collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          mode="inline"
          items={menuItems}
          style={{
            background: "linear-gradient(to bottom right, #3B82F6, #A855F7)",
          }}
          theme="dark"
          inlineCollapsed={collapse}
          onClick={(e) => window && window.location.replace(e.key)}
        />
      </Layout>
    </div>
  );
};
