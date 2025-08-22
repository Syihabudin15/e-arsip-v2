import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { EProdukType, Produk, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const produkType: EProdukType | undefined = <any>(
    req.nextUrl.searchParams.get("produkType")
  );
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;

  try {
    const find = await prisma.produk.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [{ code: { contains: search } }, { name: { contains: search } }],
        }),
        ...(produkType && { produkType: produkType }),
      },
      skip,
      take: pageSize,
      orderBy: { produkType: "desc" },
    });
    const total = await prisma.produk.count({
      where: {
        status: true,
        ...(search && {
          OR: [{ code: { contains: search } }, { name: { contains: search } }],
        }),
        ...(produkType && { produkType: produkType }),
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
  const temp: Produk = await req.json();
  const { id, ...data } = temp;
  try {
    const find = await prisma.produk.findFirst({
      where: { code: data.code },
    });
    if (find) {
      await logActivity(
        req,
        "Gagal Tambah Produk",
        "POST",
        "produk",
        JSON.stringify({ status: 400, msg: "Bad Request" }),
        "Gagal Menambahkan produk karena Kode Produk telah digunakan " +
          data.code
      );
      return NextResponse.json(
        { data: null, status: 400, msg: "Kode Produk telah digunakan!" },
        { status: 400 }
      );
    }
    await prisma.produk.create({
      data,
    });
    await logActivity(
      req,
      "Tambah Produk",
      "POST",
      "produk",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil Menambahkan Produk ${data.name} (${data.code})`
    );
    return NextResponse.json({ data, status: 201, msg: "OK" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const temp: Produk = await req.json();
  const { id, ...data } = temp;
  try {
    const find = await prisma.produk.findFirst({
      where: { id: id },
    });
    if (!find) {
      await logActivity(
        req,
        `Gagal ${data.status ? "Update" : "Hapus"} Produk`,
        data.status ? "PUT" : "DELETE",
        "produk",
        JSON.stringify({ status: 404, msg: "Not Found" }),
        `Gagal ${
          data.status ? "Update" : "Hapus"
        } Produk karena data tidak ditemukan ${data.name}`
      );
      return NextResponse.json(
        { data: null, status: 404, msg: "Data Produk tidak ditemukan!" },
        { status: 404 }
      );
    }
    await prisma.produk.update({
      where: { id: id },
      data: { ...data, updatedAt: new Date() },
    });
    await logActivity(
      req,
      `${data.status ? "Update" : "Hapus"} Produk`,
      data.status ? "PUT" : "DELETE",
      "produk",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil ${data.status ? "Update" : "Hapus"} Produk ${find.name}`
    );
    return NextResponse.json({ data, status: 201, msg: "OK" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
