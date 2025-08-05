import { IPermohonanKredit } from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
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
        Document: { include: { User: true } },
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
    const { id, JenisPemohon, Document, ...permohonan } = data;
    const { id: docId, User, ...doc } = data.Document;
    await prisma.$transaction(async (tx) => {
      const saveDoc = await prisma.document.create({
        data: doc,
      });
      const savePermohonan = await prisma.permohonanKredit.create({
        data: { ...permohonan, documentId: saveDoc.id },
      });
      return saveDoc;
    });
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
export const PUT = async (req: NextRequest) => {
  const data: IPermohonanKredit = await req.json();
  try {
    const { id, JenisPemohon, Document, ...permohonan } = data;
    const { id: docId, User, ...doc } = data.Document;
    await prisma.$transaction([
      prisma.permohonanKredit.update({ where: { id: id }, data: permohonan }),
      prisma.document.update({ where: { id: docId }, data: doc }),
    ]);
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
