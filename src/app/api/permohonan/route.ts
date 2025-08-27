import { IFiles, IPermohonan, IRootFiles } from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { EProdukType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const produkType: EProdukType | undefined = <any>(
    req.nextUrl.searchParams.get("produkType")
  );
  const jenisId: number = parseInt(
    req.nextUrl.searchParams.get("jenisId") || "0"
  );
  const produkId: number = parseInt(
    req.nextUrl.searchParams.get("produkId") || "0"
  );
  const id: number = parseInt(req.nextUrl.searchParams.get("id") || "0");
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  try {
    const find = await prisma.permohonan.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [
            {
              Pemohon: {
                OR: [
                  { fullname: { contains: search } },
                  { NIK: { contains: search } },
                  { noCIF: { contains: search } },
                ],
              },
            },
            { accountNumber: { contains: search } },
          ],
        }),
        ...(id !== 0 && { id }),
        ...(jenisId !== 0 && { Pemohon: { jenisPemohonId: jenisId } }),
        ...(produkId !== 0 && { produkId: produkId }),
        ...(produkType && { Produk: { produkType: produkType } }),
      },
      include: {
        User: true,
        Pemohon: {
          include: {
            JenisPemohon: true,
            Permohonan: true,
          },
        },
        Produk: true,
        Files: true,
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.permohonan.count({
      where: {
        status: true,
        ...(search && {
          OR: [
            {
              Pemohon: {
                OR: [
                  { fullname: { contains: search } },
                  { NIK: { contains: search } },
                  { noCIF: { contains: search } },
                ],
              },
            },
            { accountNumber: { contains: search } },
          ],
        }),
        ...(id !== 0 && { id }),
        ...(jenisId !== 0 && { Pemohon: { jenisPemohonId: jenisId } }),
        ...(produkId !== 0 && { produkId: produkId }),
        ...(produkType && { Produk: { produkType: produkType } }),
      },
    });

    const findRootFile = await prisma.rootFiles.findMany({
      where: { ...(produkType && { produkType }) },
      orderBy: { order: "asc" },
    });
    const newData: IPermohonan[] = [];

    for (const permohonan of find) {
      const rf: IRootFiles[] = [];
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
  const data: IPermohonan = await req.json();
  try {
    const { id, Pemohon, User, RootFiles, Produk, ...permohonan } = data;
    const findPemohon = await prisma.pemohon.findFirst({
      where: { noCIF: Pemohon.noCIF },
    });
    if (findPemohon && findPemohon.NIK !== Pemohon.NIK) {
      return NextResponse.json(
        { status: 400, msg: "CIF Sudah digunakan oleh NIK lain" },
        { status: 400 }
      );
    }
    await prisma.$transaction(async (tx) => {
      if (!findPemohon) {
        const { id, JenisPemohon, ...pemohon } = Pemohon;
        const pmhn = await prisma.pemohon.create({ data: pemohon });
        permohonan.pemohonId = pmhn.id;
      }
      const pk = await tx.permohonan.create({
        data: permohonan,
      });
      for (const root of RootFiles) {
        const files = root.Files.map((f) => ({
          ...f,
          permohonanId: pk.id,
        }));
        await tx.files.createMany({ data: files });
      }
      return pk;
    });
    await logActivity(
      req,
      "Tambah Permohonan " + data.Produk.produkType,
      "POST",
      "permohonan",
      JSON.stringify({ status: 201, msg: "OK" }),
      "Berhasil Menambahkan Permohonan " +
        data.Produk.produkType +
        " " +
        data.Pemohon.fullname
    );
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const data: IPermohonan = await req.json();
  try {
    const { id, User, RootFiles, Pemohon, Produk, ...permohonan } = data;
    await prisma.$transaction([
      prisma.permohonan.update({ where: { id: id }, data: permohonan }),
      prisma.files.deleteMany({
        where: { permohonanId: id },
      }),
      ...RootFiles.map((rf) =>
        prisma.files.createMany({
          data: rf.Files.map((f: any) => {
            const { PermohonanAction, RootFiles, ...newF } = f;
            return { ...newF, permohonanId: id };
          }),
        })
      ),
    ]);
    await logActivity(
      req,
      `${data.status ? "Update" : "Hapus"}  Permohonan ${
        data.Produk.produkType
      }`,
      data.status ? "PUT" : "DELETE",
      "permohonan",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil ${data.status ? "Update" : "Hapus"} Permohonan ${
        data.Produk.produkType
      } ${data.Pemohon.fullname}`
    );
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  try {
    await prisma.permohonan.update({
      where: { id: data.id },
      data: { status: data.status, updatedAt: data.updatedAt },
    });
    await logActivity(
      req,
      `Hapus  Permohonan ${data.Produk.produkType}`,
      "DELETE",
      "permohonan",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil Hapus Permohonan ${data.Produk.produkType} ${data.Pemohon.fullname}`
    );
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
