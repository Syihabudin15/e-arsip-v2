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
    totalPemohon,
    totalKredit,
    totalTabungan,
    totalDeposito,
    totalProduk,
  ] = await Promise.all([
    prisma.user.count({ where: { status: true } }),
    prisma.role.count({ where: { status: true } }),
    prisma.files.count(),
    prisma.permohonan.count({
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
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.permohonan.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        status: true,
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
    prisma.pemohon.count({ where: { status: true } }),
    prisma.permohonan.count({
      where: { Produk: { produkType: "KREDIT" }, status: true },
    }),
    prisma.permohonan.count({
      where: { Produk: { produkType: "TABUNGAN" }, status: true },
    }),
    prisma.permohonan.count({
      where: { Produk: { produkType: "DEPOSITO" }, status: true },
    }),
    prisma.produk.count({ where: { status: true } }),
  ]);

  const groupedLogs = [];
  const groupedPengajuan = [];

  for (let tm = 6; tm >= 0; tm--) {
    const filtered = logsPerDay.filter(
      (f) =>
        moment(f.createdAt).format("DD/MM/YYYY") ===
        moment().add(-tm, "day").format("DD/MM/YYYY")
    );
    groupedLogs.push({
      createdAt: moment().add(-tm, "day").format("DD/MM/YY"),
      _count: filtered.length,
    });
  }
  for (let tm = 5; tm >= 0; tm--) {
    const filtered = pengajuanPerBulan.filter(
      (f) =>
        moment(f.createdAt).format("MM/YYYY") ===
        moment()
          .add(-tm, "month")
          // .set("month", moment().get("month") - tm)
          .format("MM/YYYY")
    );
    groupedPengajuan.push({
      createdAt: moment()
        .set("month", moment().get("month") - tm)
        .format("MM/YY"),
      _count: filtered.length,
    });
  }

  // Data tabel terbaru
  const lastPermohonan = await prisma.permohonan.findMany({
    where: { status: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      Pemohon: {
        include: { JenisPemohon: true },
      },
      Produk: true,
      Files: true,
      User: true,
    },
  });

  const lastLogs = await prisma.logs.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { User: true },
  });

  return NextResponse.json({
    cards: {
      totalUsers,
      totalRoles,
      totalDocuments,
      totalPermohonanHariIni,
      totalPemohon,
      totalKredit,
      totalTabungan,
      totalDeposito,
      totalProduk,
    },
    charts: {
      logsPerDay: groupedLogs,
      pengajuanPerBulan: groupedPengajuan,
      topUsers,
    },
    tables: { lastPermohonan, lastLogs },
  });
}
