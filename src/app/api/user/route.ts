import prisma from "@/components/Prisma";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcript from "bcrypt";
import { logActivity } from "@/components/utils/Auth";

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const role: string | undefined = <any>req.nextUrl.searchParams.get("role");
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;

  try {
    const find = await prisma.user.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { username: { contains: search } },
            { email: { contains: search } },
          ],
        }),
        ...(role && {
          role: {
            roleName: role,
          },
        }),
      },
      skip,
      take: pageSize,
      include: {
        role: true,
      },
    });
    const total = await prisma.user.count({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { username: { contains: search } },
            { email: { contains: search } },
          ],
        }),
        ...(role && {
          role: {
            roleName: role,
          },
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
  const { id, ...data }: User = await req.json();
  try {
    const find = await prisma.user.findFirst({
      where: { username: data.username },
    });
    if (find) {
      await logActivity(
        req,
        "Tambah User",
        "POST",
        "user",
        JSON.stringify(data),
        JSON.stringify({ status: 400, msg: "Bad Request" }),
        "Gagal menambahkan user karena username sudah digunakan"
      );
      return NextResponse.json(
        { status: 400, msg: "Username telah digunakan" },
        { status: 400 }
      );
    }
    const pass = await bcript.hash(data.password, 10);
    await prisma.user.create({ data: { ...data, password: pass } });
    await logActivity(
      req,
      "Tambah User",
      "POST",
      "user",
      JSON.stringify(data),
      JSON.stringify({ status: 201, msg: "OK" }),
      "Berhasil menambahkan user " + data.fullname
    );
    return NextResponse.json({ status: 201, msg: "OK" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
export const PUT = async (req: NextRequest) => {
  const { id, role, ...data } = await req.json();
  try {
    const find = await prisma.user.findFirst({
      where: { id: id },
    });
    if (!find) {
      await logActivity(
        req,
        "Gagal Update User",
        "PUT",
        "user",
        JSON.stringify(data),
        JSON.stringify({ status: 404, msg: "Bad Request" }),
        "Gagal Update user karena user tidak ditemukan"
      );
      return NextResponse.json(
        { status: 404, msg: "Uset not found" },
        { status: 404 }
      );
    }
    if (data.password !== find.password) {
      const has = await bcript.hash(data.password, 10);
      data.password = has;
    }
    await prisma.user.update({
      where: { id: id },
      data: { ...data, updatedAt: new Date() },
    });
    await logActivity(
      req,
      `${data.status ? "Update" : "Hapus"} User`,
      data.status ? "PUT" : "DELETE",
      "user",
      JSON.stringify(data),
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil ${data.status ? "Update" : "Hapus"} user ${find.fullname}`
    );
    return NextResponse.json({ status: 200, msg: "OK" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
