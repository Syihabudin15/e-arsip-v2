import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { Role } from "@prisma/client";
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
    const find = await prisma.role.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [{ roleName: { contains: search } }],
        }),
      },
      skip,
      take: pageSize,
    });
    const total = await prisma.role.count({
      where: {
        status: true,
        ...(search && {
          OR: [{ roleName: { contains: search } }],
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
  const temp: Role = await req.json();
  const { id, ...data } = temp;
  try {
    const find = await prisma.role.findFirst({
      where: { roleName: data.roleName },
    });
    if (find) {
      await logActivity(
        req,
        "Gagal Tambah Role",
        "POST",
        "role",
        JSON.stringify(data),
        JSON.stringify({ status: 400, msg: "Bad Request" }),
        "Gagal Menambahkan Role karena nama role sudah tersedia " +
          data.roleName
      );
      return NextResponse.json(
        { data: null, status: 400, msg: "Nama Role sudah tersedia!" },
        { status: 400 }
      );
    }
    await prisma.role.create({
      data,
    });
    await logActivity(
      req,
      "Tambah Role",
      "POST",
      "role",
      JSON.stringify(data),
      JSON.stringify({ status: 201, msg: "OK" }),
      "Berhasil Menambahkan Role " + data.roleName
    );
    return NextResponse.json({ data, status: 201, msg: "OK" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const temp: Role = await req.json();
  const { id, ...data } = temp;
  try {
    const find = await prisma.role.findFirst({
      where: { id: id },
    });
    if (!find) {
      await logActivity(
        req,
        `Gagal ${data.status ? "Update" : "Hapus"} Role`,
        data.status ? "PUT" : "DELETE",
        "role",
        JSON.stringify(data),
        JSON.stringify({ status: 404, msg: "Not Found" }),
        `Gagal ${
          data.status ? "Update" : "Hapus"
        } Role karena data tidak ditemukan ${data.roleName}`
      );
      return NextResponse.json(
        { data: null, status: 404, msg: "Data role tidak ditemukan!" },
        { status: 404 }
      );
    }
    await prisma.role.update({
      where: { id: id },
      data: { ...data, updatedAt: new Date() },
    });
    await logActivity(
      req,
      `${data.status ? "Update" : "Hapus"} Role`,
      data.status ? "PUT" : "DELETE",
      "role",
      JSON.stringify(data),
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil ${data.status ? "Update" : "Hapus"} Role ${find.roleName}`
    );
    return NextResponse.json({ data, status: 200, msg: "OK" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
