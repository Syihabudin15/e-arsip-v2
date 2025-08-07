"use client";

import { Logs, Role, User } from "@prisma/client";
import { Input, Select, Table, TableProps, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

interface ILogs extends Logs {
  User: User;
}

export default function TableLogs() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [data, setData] = useState<ILogs[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<string>();
  const [tableName, setTableName] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [activity, setActivity] = useState<string>();

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/logs?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }${method ? "&method=" + method : ""}${
        tableName ? "&table=" + tableName : ""
      }${userId ? "&userId=" + userId : ""}${
        activity ? "&name=" + activity : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: Role) => ({ ...d, key: d.id })));
        setTotal(res.total);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page, pageSize, method, tableName, userId, activity]);

  const columns: TableProps<ILogs>["columns"] = [
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
      title: "AKTIVITAS",
      dataIndex: "name",
      key: "name",
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
      filterDropdown: () => (
        <Select
          options={[
            { label: "Login", value: "login" },
            { label: "Tambah Data", value: "Tambah" },
            { label: "Update Data", value: "Update" },
            { label: "Hapus Data", value: "Hapus" },
            { label: "Upload", value: "Upload" },
          ]}
          allowClear
          onChange={(e) => setActivity(e)}
          style={{ width: "100%" }}
        />
      ),
      render(value, record, index) {
        return <>{record.name}</>;
      },
    },
    {
      title: "METHOD",
      dataIndex: "method",
      key: "method",
      className: "method",
      width: 100,
      filterDropdown: () => (
        <Select
          options={[
            { label: "POST", value: "POST" },
            { label: "PUT", value: "PUT" },
            { label: "DELETE", value: "DELETE" },
          ]}
          allowClear
          onChange={(e) => setMethod(e)}
          style={{ width: "100%" }}
        />
      ),
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.method}</>;
      },
    },
    {
      title: "REQUEST PATH",
      dataIndex: "path",
      key: "path",
      className: "method",
      width: 150,
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
      title: "NAMA TABLE",
      dataIndex: "table",
      key: "table",
      className: "method",
      width: 100,
      filterDropdown: () => (
        <Select
          options={[
            { label: "Role", value: "role" },
            { label: "User", value: "user" },
            { label: "Jenis Pemohon", value: "jenisPemohon" },
            { label: "Permohonan Kredit", value: "permohonanKredit" },
            { label: "Document", value: "document" },
          ]}
          allowClear
          onChange={(e) => setTableName(e)}
          style={{ width: "100%" }}
        />
      ),
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.table}</>;
      },
    },
    {
      title: "SERVER IP",
      dataIndex: "serverIP",
      key: "serverIP",
      className: "method",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.serverIP}</>;
      },
    },
    {
      title: "USER AGENT",
      dataIndex: "userAgent",
      key: "userAgent",
      className: "method",
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
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              {record.userAgent}
            </Paragraph>
          </>
        );
      },
    },
    {
      title: "SEND DATA",
      dataIndex: "sendData",
      key: "sendData",
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
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              {record.sendData}
            </Paragraph>
          </>
        );
      },
    },
    {
      title: "RETURN STATUS",
      dataIndex: "returnStatus",
      key: "returnStatus",
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
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              {record.returnStatus}
            </Paragraph>
          </>
        );
      },
    },
    {
      title: "DETAIL",
      dataIndex: "detail",
      key: "detail",
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
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              {record.detail}
            </Paragraph>
          </>
        );
      },
    },
    {
      title: "USER",
      dataIndex: "user",
      key: "user",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      filterDropdown: () => (
        <Select
          options={[
            { label: "SYIHABUDIN", value: 1 },
            { label: "OLDY", value: 2 },
          ]}
          allowClear
          onChange={(e) => setUserId(e)}
          style={{ width: "100%" }}
        />
      ),
      render(value, record, index) {
        return <>{record.User && record.User.fullname}</>;
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
  ];

  return (
    <Table
      title={() => (
        <div>
          <div className="border-b border-blue-500 py-2">
            <h1 className="font-bold text-xl">User Activities</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div className="flex gap-2"></div>
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
