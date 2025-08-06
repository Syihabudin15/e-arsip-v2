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
      <Row gutter={16}>
        <Col span={6}>
          <Card title="Total Users">
            <p className="font-bold text-xl">{cards.totalUsers}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Total Roles">
            <p className="font-bold text-xl">{cards.totalRoles}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Total Dokumen">
            <p className="font-bold text-xl">{cards.totalDocuments}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Pengajuan Hari Ini">
            <p className="font-bold text-xl">{cards.totalPermohonanHariIni}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="my-4">
        <Col span={12}>
          <Card title="Aktivitas Logs 7 Hari">
            <Line data={logData} xField="date" yField="count" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Pengajuan Kredit 6 Bulan">
            <Line data={pengajuanData} xField="date" yField="count" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="my-4">
        <Col span={12}>
          <Card title="Permohonan Terbaru">
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
        <Col span={12}>
          <Card title="Aktivitas User Terakhir">
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
