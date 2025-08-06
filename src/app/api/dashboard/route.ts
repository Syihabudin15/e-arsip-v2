import prisma from "@/components/Prisma";
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

  // Data tabel terbaru
  const lastPermohonan = await prisma.permohonanKredit.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { JenisPemohon: true },
  });

  const lastLogs = await prisma.logs.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { User: true },
  });

  return NextResponse.json({
    cards: { totalUsers, totalRoles, totalDocuments, totalPermohonanHariIni },
    charts: { logsPerDay, pengajuanPerBulan, topUsers },
    tables: { lastPermohonan, lastLogs },
  });
}
