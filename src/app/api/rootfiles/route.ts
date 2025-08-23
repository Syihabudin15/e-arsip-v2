import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { EProdukType, RootFiles } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const status: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const produkType: EProdukType | undefined = <any>(
    req.nextUrl.searchParams.get("produkType")
  );
  const resourceType: string | undefined = <any>(
    req.nextUrl.searchParams.get("resourceType")
  );
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  try {
    const data = await prisma.rootFiles.findMany({
      where: {
        ...(status
          ? { status: status === "active" ? true : false }
          : { status: true }),
        ...(produkType && { produkType: produkType }),
        ...(search && { name: { contains: search } }),
        ...(resourceType && { resourceType: resourceType }),
      },
      include: {
        Files: true,
      },
      orderBy: { order: "asc" },
      skip: skip,
      take: pageSize,
    });
    const total = await prisma.rootFiles.count({
      where: {
        ...(status
          ? { status: status === "active" ? true : false }
          : { status: true }),
        ...(produkType && { produkType: produkType }),
        ...(search && { name: { contains: search } }),
        ...(resourceType && { resourceType: resourceType }),
      },
    });
    return NextResponse.json({ data, total, status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { status: 500, msg: "Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.rootFiles.findFirst({
      where: { name: data.name },
    });
    if (find) {
      await logActivity(
        req,
        "Tambah Data Rootfiles",
        "POST",
        "rootFiles",
        JSON.stringify({ status: 400, msg: "BAD REQUEST" }),
        `Gagal menambahkan data Rootfiles ${data.name} karena nama sudah digunakan`
      );
      return NextResponse.json(
        { status: 400, msg: "Nama Rootfiles sudah digunakan!" },
        { status: 400 }
      );
    }
    const { id, Files, ...saveData } = data;
    await prisma.rootFiles.create({ data: saveData });
    await logActivity(
      req,
      "Tambah Data Rootfiles",
      "POST",
      "rootFiles",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil menambahkan data Rootfiles Baru ${data.name} ResourceType: ${data.resourceType}`
    );
    return NextResponse.json(
      { status: 201, msg: "Berhasil menambahkan data Rootfiles baru" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { status: 500, msg: "Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.rootFiles.findFirst({
      where: { name: data.name },
    });
    if (find && find.id !== data.id) {
      await logActivity(
        req,
        "Update Data Rootfiles",
        "PUT",
        "rootFiles",
        JSON.stringify({ status: 400, msg: "BAD REQUEST" }),
        `Gagal update data Rootfiles ${data.name} karena nama sudah digunakan`
      );
      return NextResponse.json(
        { status: 400, msg: "Nama Rootfiles sudah digunakan!" },
        { status: 400 }
      );
    }
    const { id, Files, ...saveData } = data;
    await prisma.rootFiles.update({ where: { id: data.id }, data: saveData });
    await logActivity(
      req,
      "Update Data Rootfiles",
      "PUT",
      "rootFiles",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil update data Rootfiles ${data.name} (${moment().format(
        "DD/MM/YYYY HH:mm"
      )})`
    );
    return NextResponse.json(
      { status: 201, msg: "Updat data Rootfiles berhasil" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { status: 500, msg: "Server Error" },
      { status: 500 }
    );
  }
};
export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const { id, Files, ...saveData } = data;
    await prisma.rootFiles.update({ where: { id: data.id }, data: saveData });
    await logActivity(
      req,
      "Hapus Data Rootfiles",
      "DELETE",
      "rootFiles",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil hapus data Rootfiles ${data.name} ID: ${data.id}`
    );
    return NextResponse.json(
      { status: 201, msg: "Updat data Rootfiles berhasil" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { status: 500, msg: "Server Error" },
      { status: 500 }
    );
  }
};
