import { IFiles, IPermohonan } from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { data: null, msg: "Not Found", status: 404 },
      { status: 404 }
    );
  try {
    const data = await prisma.permohonan.findFirst({
      where: { id: parseInt(id) },
      include: {
        Pemohon: {
          include: { JenisPemohon: true, Permohonan: true },
        },
        Produk: true,
        User: true,
      },
    });
    if (!data) {
      return NextResponse.json(
        { data: null, msg: "Not Found", status: 404 },
        { status: 404 }
      );
    }

    const findRootFile = await prisma.rootFiles.findMany({
      where: {
        produkType: data.Produk.produkType,
      },
      orderBy: { order: "asc" },
    });
    const newData: IPermohonan = { ...data, RootFiles: [] };

    for (const root of findRootFile) {
      const files: IFiles[] = <any>await prisma.files.findMany({
        where: {
          rootFilesId: root.id,
          permohonanId: data.id,
        },
        include: { PermohonanAction: true },
      });
      newData.RootFiles.push({ ...root, Files: files });
    }

    return NextResponse.json(
      { data: newData, msg: "OK", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { data: null, msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};
