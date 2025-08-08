"use client";
import { Card, Col, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import moment from "moment";
const { Paragraph } = Typography;
export default function DashboardMaster() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (!data) return <div>Loading...</div>;

  const { cards, charts, tables } = data;

  const logData = charts.logsPerDay.map((l: any) => ({
    date: new Date(l.createdAt).toLocaleDateString(),
    count: l._count,
  }));

  const pengajuanData = charts.pengajuanPerBulan.map((p: any) => ({
    date: new Date(p.createdAt).toLocaleDateString(),
    count: p._count,
  }));

  const columnsPermohonan = [
    {
      title: "MARKETING",
      dataIndex: ["Document", "User", ["fullname"]],
      key: "marketingName",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
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
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
      },
    },
    {
      title: "NIK",
      dataIndex: "NIK",
      key: "NIK",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
      },
    },
    {
      title: "JENIS PEMOHON",
      dataIndex: ["JenisPemohon", "name"],
      key: "jenis",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
      },
    },
    {
      title: "TANGGAL",
      dataIndex: "createdAt",
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
      },
      render: (v: string) => moment(v).format("DD/MM/YYYY HH:mm"),
    },
  ];

  const columnsLogs = [
    {
      title: "USER",
      dataIndex: ["User", "fullname"],
      key: "user",
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
      },
    },
    {
      title: "METHOD",
      dataIndex: "method",
      key: "method",
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
      },
    },
    {
      title: "TABLE",
      dataIndex: "table",
      key: "table",
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
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
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 12,
          },
        };
      },
      render: (v: string) => (
        <>
          <Paragraph
            ellipsis={{
              rows: 1,
              expandable: "collapsible",
            }}
            style={{ fontSize: 12 }}
          >
            {v}
          </Paragraph>
        </>
      ),
    },
    {
      title: "Tanggal",
      dataIndex: "createdAt",
      className: "text-xs",
      render: (v: string) => moment(v).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div className="p-2 h-[92vh] overflow-auto">
      {/* Cards */}
      <Row gutter={[16, 16]} wrap>
        <Col span={6} xs={12} md={8} lg={6}>
          <Card
            title="Total Users"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <p className="font-bold text-xl">{cards.totalUsers}</p>
          </Card>
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <Card
            title="Total Roles"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <p className="font-bold text-xl">{cards.totalRoles}</p>
          </Card>
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <Card
            title="Total Permohnan"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <p className="font-bold text-xl">{cards.totalDocuments}</p>
          </Card>
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <Card
            title="Permohonan Hari Ini"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <p className="font-bold text-xl">{cards.totalPermohonanHariIni}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="my-4">
        <Col span={12} xs={24} lg={12}>
          <Card
            title="Aktivitas Logs 7 Hari"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <Line data={logData} xField="date" yField="count" />
          </Card>
        </Col>
        <Col span={12} xs={24} lg={12}>
          <Card
            title="Pengajuan Kredit 6 Bulan"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <Line data={pengajuanData} xField="date" yField="count" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="my-4">
        <Col span={12} xs={24}>
          <Card
            title="Permohonan Terbaru"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <Table
              dataSource={tables.lastPermohonan.map((d: any) => ({
                ...d,
                key: d.id,
              }))}
              columns={columnsPermohonan}
              size="small"
              pagination={false}
              scroll={{ x: "max-content", y: 300 }}
              bordered
            />
          </Card>
        </Col>
        <Col span={12} xs={24}>
          <Card
            title="Aktivitas User Terakhir"
            styles={{
              header: {
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              },
            }}
          >
            <Table
              dataSource={tables.lastLogs.map((d: any) => ({
                ...d,
                key: d.id,
              }))}
              columns={columnsLogs}
              size="small"
              pagination={false}
              scroll={{ x: "max-content", y: 300 }}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
