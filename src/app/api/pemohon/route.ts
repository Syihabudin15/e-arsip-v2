import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { Pemohon } from "@prisma/client";
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
    const find = await prisma.pemohon.findMany({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { NIK: { contains: search } },
            { accountNumber: { contains: search } },
          ],
        }),
      },
      skip,
      take: pageSize,
    });
    const total = await prisma.pemohon.count({
      where: {
        status: true,
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { NIK: { contains: search } },
            { accountNumber: { contains: search } },
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
  const data: Pemohon = await req.json();
  try {
    const find = await prisma.pemohon.findFirst({
      where: { accountNumber: data.accountNumber },
    });
    if (find) {
      await logActivity(
        req,
        "Tambah Data Pemohon",
        "POST",
        "pemohon",
        JSON.stringify({ status: 400, msg: "Nomor CIF sudah digunakan!" }),
        `Gagal menambahkan data pemohon karena nomor CIF sudah digunakan`
      );
      return NextResponse.json(
        { msg: "Nomor CIF Sudah digunakan!", status: 400 },
        { status: 400 }
      );
    }
    const { id, ...savedData } = data;
    await prisma.pemohon.create({ data: savedData });
    await logActivity(
      req,
      "Tambah Data Pemohon",
      "POST",
      "pemohon",
      JSON.stringify({ status: 201, msg: "Berhasil" }),
      `Berhasil menambahkan data pemohon ${data.fullname} (${data.NIK}) dengan nomor CIF ${data.accountNumber}`
    );
    return NextResponse.json(
      {
        msg: `Berhasil menambahkan data pemohon ${data.fullname} (${data.NIK}) dengan nomor CIF ${data.accountNumber}`,
        status: 201,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const data: Pemohon = await req.json();
  try {
    const { id, ...savedData } = data;

    await prisma.pemohon.update({
      where: { id: id },
      data: { ...savedData, updatedAt: new Date() },
    });
    await logActivity(
      req,
      "Update Data Pemohon",
      "PUT",
      "pemohon",
      JSON.stringify({ status: 201, msg: "Berhasil" }),
      `Berhasil update data pemohon ${data.fullname} (${data.NIK}) bernomor CIF ${data.accountNumber}`
    );
    return NextResponse.json(
      {
        msg: `Berhasil update data pemohon ${data.fullname} (${data.NIK}) bernomor CIF ${data.accountNumber}`,
        status: 201,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  const data: Pemohon = await req.json();
  try {
    const { id, ...savedData } = data;
    await prisma.pemohon.update({
      where: { id: id },
      data: { ...savedData, updatedAt: new Date() },
    });
    await logActivity(
      req,
      "Delete Data Pemohon",
      "DELETE",
      "pemohon",
      JSON.stringify({ status: 201, msg: "Berhasil" }),
      `Berhasil delete data pemohon ${data.fullname} (${data.NIK}) bernomor CIF ${data.accountNumber}`
    );
    return NextResponse.json(
      {
        msg: `Berhasil delete data pemohon ${data.fullname} (${data.NIK}) bernomor CIF ${data.accountNumber}`,
        status: 201,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
