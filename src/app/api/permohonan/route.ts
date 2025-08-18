import { sendEmail } from "@/components/IEmail";
import { IPermohonanKredit } from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { StatusAction } from "@prisma/client";
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
        Document: {
          include: {
            PermohonanAction: { where: { statusAction: StatusAction.PENDING } },
          },
        },
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
  const data: IPermohonanKredit = await req.json();
  try {
    const { id, JenisPemohon, User, Document, ...permohonan } = data;
    const { id: docId, PermohonanAction, ...doc } = data.Document;
    await prisma.$transaction(async (tx) => {
      const saveDoc = await tx.document.create({
        data: doc,
      });
      await tx.permohonanKredit.create({
        data: { ...permohonan, documentId: saveDoc.id },
      });
      return saveDoc;
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
    await sendEmail(
      process.env.EMAIL_RECEIVER_DEFAULT || "",
      "",
      "Permohonan Kredit Baru",
      "Ada penambahan permohonan kredit baru"
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
    const { id, JenisPemohon, User, Document, ...permohonan } = data;
    const { id: docId, PermohonanAction, ...doc } = data.Document;
    await prisma.$transaction([
      prisma.permohonanKredit.update({ where: { id: id }, data: permohonan }),
      prisma.document.update({ where: { id: docId }, data: doc }),
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
    await sendEmail(
      process.env.EMAIL_RECEIVER_DEFAULT || "",
      "",
      "Perubahan pada data Permohonan Kredit",
      `Data Permohnan Kredit ${data.fullname} berubah`
    );
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
