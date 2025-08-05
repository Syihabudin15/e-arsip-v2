import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { data: null, msg: "Not Found", status: 404 },
      { status: 404 }
    );
  try {
    const data = await prisma.permohonanKredit.findFirst({
      where: { id: parseInt(id) },
      include: {
        Document: {
          include: { User: true },
        },
        JenisPemohon: true,
      },
    });
    return NextResponse.json({ data, msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { data: null, msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};
