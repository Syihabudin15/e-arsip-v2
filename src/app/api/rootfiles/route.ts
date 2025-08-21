import prisma from "@/components/Prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const data = await prisma.rootFiles.findMany();
  return NextResponse.json({ data, status: 200 }, { status: 200 });
};
