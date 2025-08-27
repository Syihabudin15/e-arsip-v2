import {
  IFiles,
  IPemohon,
  IPermohonan,
  IRootFiles,
} from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const jenisId: number = parseInt(
    req.nextUrl.searchParams.get("jenisId") || "0"
  );
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  try {
    const find = await prisma.pemohon.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { NIK: { contains: search } },
            { noCIF: { contains: search } },
          ],
        }),
        ...(jenisId !== 0 && { jenisPemohonId: jenisId }),
      },
      include: {
        Permohonan: {
          include: {
            Produk: true,
            Pemohon: { include: { JenisPemohon: true } },
            Files: { include: { RootFiles: true } },
            User: true,
          },
          orderBy: { createdAt: "desc" },
        },
        JenisPemohon: true,
      },
      take: pageSize,
      skip: skip,
    });
    const total = await prisma.pemohon.count({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { NIK: { contains: search } },
            { noCIF: { contains: search } },
          ],
        }),
        ...(jenisId !== 0 && { jenisPemohonId: jenisId }),
      },
    });
    const fixData: IPemohon[] = [];
    for (const pemohon of find) {
      const newData: IPermohonan[] = [];
      for (const permohonan of pemohon.Permohonan) {
        const rf: IRootFiles[] = [];
        const findRootFile = await prisma.rootFiles.findMany({
          where: { produkType: permohonan.Produk.produkType },
          orderBy: { order: "asc" },
        });
        for (const root of findRootFile) {
          const files: IFiles[] = <any>await prisma.files.findMany({
            where: {
              rootFilesId: root.id,
              permohonanId: permohonan.id,
            },
            include: {
              PermohonanAction: true,
              RootFiles: true,
            },
          });
          rf.push({ ...root, Files: files });
        }
        newData.push({ ...permohonan, RootFiles: rf });
      }
      fixData.push({ ...pemohon, Permohonan: newData });
    }
    return NextResponse.json(
      { data: fixData, total, status: 200, msg: "Server error" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { status: 500, msg: "Server error" },
      { status: 500 }
    );
  }
};
