import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const id: number | undefined = parseInt(
    req.nextUrl.searchParams.get("id") || "0"
  );
  if (!id) {
    return NextResponse.json(
      { data: null, msg: "Not Found", status: 404 },
      { status: 404 }
    );
  }
  try {
    const find = await prisma.role.findFirst({
      where: { id: id },
    });

    return NextResponse.json(
      { data: find, msg: "OK", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};
