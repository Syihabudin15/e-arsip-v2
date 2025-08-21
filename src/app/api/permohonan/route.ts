import {
  IFiles,
  IPermohonanKredit,
  IRootFiles,
} from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
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
    const find = await prisma.permohonanKredit.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { NIK: { contains: search } },
          ],
        }),
        ...(jenisId !== 0 && { jenisPemohonId: jenisId }),
      },
      include: {
        JenisPemohon: true,
        User: true,
      },
      skip,
      take: pageSize,
    });
    const total = await prisma.permohonanKredit.count({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { NIK: { contains: search } },
          ],
        }),
        ...(jenisId !== 0 && { jenisPemohonId: jenisId }),
      },
    });

    const findRootFile = await prisma.rootFiles.findMany();
    const newData: IPermohonanKredit[] = [];

    for (const permohonan of find) {
      const rf: IRootFiles[] = [];
      for (const root of findRootFile) {
        const files: IFiles[] = <any>await prisma.files.findMany({
          where: {
            rootFilesId: root.id,
            permohonanKreditId: permohonan.id,
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

    return NextResponse.json(
      { data: newData, total, msg: "OK", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const data: IPermohonanKredit = await req.json();
  try {
    const { id, JenisPemohon, User, RootFiles, ...permohonan } = data;
    await prisma.$transaction(async (tx) => {
      const pk = await tx.permohonanKredit.create({
        data: permohonan,
      });
      for (const root of RootFiles) {
        const files = root.Files.map((f) => ({
          ...f,
          permohonanKreditId: pk.id,
        }));
        await tx.files.createMany({ data: files });
      }
      return pk;
    });
    await logActivity(
      req,
      "Tambah Permohonan Kredit",
      "POST",
      "permohonanKredit",
      JSON.stringify(data),
      JSON.stringify({ status: 201, msg: "OK" }),
      "Berhasil Menambahkan Permohonan Kredit " + data.fullname
    );
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
export const PUT = async (req: NextRequest) => {
  const data: IPermohonanKredit = await req.json();
  try {
    const { id, JenisPemohon, User, RootFiles, ...permohonan } = data;
    console.log(permohonan);
    await prisma.$transaction([
      prisma.permohonanKredit.update({ where: { id: id }, data: permohonan }),
      prisma.files.deleteMany({
        where: { permohonanKreditId: id },
      }),
      ...RootFiles.map((rf) =>
        prisma.files.createMany({
          data: rf.Files.map((f: any) => {
            const { PermohonanAction, ...newF } = f;
            return { ...newF, permohonanKreditId: id };
          }),
        })
      ),
    ]);
    await logActivity(
      req,
      `${data.status ? "Update" : "Hapus"}  Permohonan Kredit`,
      data.status ? "PUT" : "DELETE",
      "permohonanKredit",
      JSON.stringify(data),
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil ${data.status ? "Update" : "Hapus"} Permohonan Kredit ${
        data.fullname
      }`
    );
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
