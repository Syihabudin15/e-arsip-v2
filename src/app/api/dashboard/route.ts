import prisma from "@/components/Prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalRoles,
    totalDocuments,
    totalPermohonanHariIni,
    logsPerDay,
    pengajuanPerBulan,
    topUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { status: true } }),
    prisma.role.count(),
    prisma.document.count({ where: { status: true } }),
    prisma.permohonanKredit.count({
      where: { status: true, createdAt: { gte: today } },
    }),
    prisma.logs.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    }),
    prisma.permohonanKredit.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
    }),
    prisma.logs.groupBy({
      by: ["userId"],
      _count: true,
      orderBy: { _count: { userId: "desc" } },
      take: 5,
    }),
  ]);

  const groupedLogs = [];
  const groupedPengajuan = [];

  for (let tm = 7; tm > 0; tm--) {
    const filtered = logsPerDay.filter(
      (f) =>
        moment(f.createdAt).format("DD/MM/YYYY") ===
        moment(new Date(new Date().setDate(new Date().getDate() - tm))).format(
          "DD/MM/YYYY"
        )
    );
    groupedLogs.push({
      createdAt: new Date(new Date().setDate(new Date().getDate() - tm)),
      _count: filtered.length,
    });
  }
  for (let tm = 5; tm >= 0; tm--) {
    const filtered = pengajuanPerBulan.filter(
      (f) =>
        moment(f.createdAt).format("MM/YYYY") ===
        moment()
          .set("month", moment().get("month") - tm)
          .format("MM/YYYY")
    );
    groupedPengajuan.push({
      createdAt: moment()
        .set("month", moment().get("month") - tm)
        .format("MM/YYYY"),
      _count: filtered.length,
    });
  }

  // Data tabel terbaru
  const lastPermohonan = await prisma.permohonanKredit.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { JenisPemohon: true, Document: { include: { User: true } } },
  });

  const lastLogs = await prisma.logs.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { User: true },
  });

  return NextResponse.json({
    cards: { totalUsers, totalRoles, totalDocuments, totalPermohonanHariIni },
    charts: {
      logsPerDay: groupedLogs,
      pengajuanPerBulan: groupedPengajuan,
      topUsers,
    },
    tables: { lastPermohonan, lastLogs },
  });
}
