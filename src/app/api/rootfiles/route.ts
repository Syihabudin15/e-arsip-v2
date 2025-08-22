import prisma from "@/components/Prisma";
import { EProdukType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const produkType: EProdukType | undefined = <any>(
    req.nextUrl.searchParams.get("produkType")
  );
  const data = await prisma.rootFiles.findMany({
    where: {
      ...(produkType && { produkType: produkType }),
    },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ data, status: 200 }, { status: 200 });
};
