import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { JenisPemohon } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  try {
    const find = await prisma.jenisPemohon.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { keterangan: { contains: search } },
          ],
        }),
      },
      skip,
      take: pageSize,
    });
    const total = await prisma.jenisPemohon.count({
      where: {
        status: true,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { keterangan: { contains: search } },
          ],
        }),
      },
    });

    return NextResponse.json(
      { data: find, total, msg: "OK", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const { id, ...data }: JenisPemohon = await req.json();
  try {
    const find = await prisma.jenisPemohon.findFirst({
      where: { name: data.name },
    });
    if (find) {
      if (find.status === false) {
        await prisma.jenisPemohon.update({
          where: { id: find.id },
          data: { ...data, status: true, updatedAt: new Date() },
        });
        await logActivity(
          req,
          "Tambah Jenis Pemohon",
          "POST",
          "jenisPemohon",
          JSON.stringify({ status: 200, msg: "OK" }),
          "Berhasil Menambahkan Jenis Pemohon"
        );
        return NextResponse.json(
          { msg: "Data sudah tersedia!", status: 200 },
          { status: 200 }
        );
      }
      await logActivity(
        req,
        "Tambah Jenis Pemohon",
        "POST",
        "jenisPemohon",
        JSON.stringify({ status: 400, msg: "Bad Request" }),
        "Gagal Menambahkan Jenis Pemohon"
      );
      return NextResponse.json(
        { msg: "Data sudah tersedia!", status: 400 },
        { status: 400 }
      );
    }
    await prisma.jenisPemohon.create({ data });
    await logActivity(
      req,
      "Tambah Jenis Pemohon",
      "POST",
      "jenisPemohon",
      JSON.stringify({ status: 200, msg: "OK" }),
      "Berhasil Menambahkan Jenis Pemohon " + data.name
    );
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const { id, ...data }: JenisPemohon = await req.json();
  try {
    const find = await prisma.jenisPemohon.findFirst({
      where: { id: id },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan!", status: 404 },
        { status: 404 }
      );
    }
    await prisma.jenisPemohon.update({ where: { id: id }, data });
    await logActivity(
      req,
      `${data.status ? "Update" : "Hapus"} Jenis Pemohon`,
      data.status ? "PUT" : "DELETE",
      "jenisPemohon",
      JSON.stringify({ status: 200, msg: "OK" }),
      `Berhasil ${data.status ? "Update" : "Hapus"} Jenis Pemohon ${find.name}`
    );
    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
