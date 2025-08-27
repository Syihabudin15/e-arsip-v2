import { FilesPA } from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  const payload = await req.json();
  const data: FilesPA = payload.File;
  if ("PermohonanAction" in data) {
    delete data.PermohonanAction;
  }
  const { id, Permohonan, RootFiles, ...savedData } = data;

  try {
    const findPermohonan = await prisma.permohonanAction.findFirst({
      where: { id: payload.actionId },
      include: {
        Files: true,
      },
    });
    if (!findPermohonan)
      return NextResponse.json(
        { status: 404, msg: "NOT FOUND" },
        { status: 404 }
      );
    const isLast = findPermohonan.Files.flatMap((f) => f.allowDownload)
      .join("")
      .split(",")
      .map(Number)
      .filter((a) => a === findPermohonan.requesterId);

    await prisma.$transaction([
      prisma.files.update({
        where: { id: data.id },
        data: {
          ...savedData,
          allowDownload: data.allowDownload
            .split(",")
            .map(Number)
            .filter((a) => a !== findPermohonan.requesterId)
            .join(","),
        },
      }),
      prisma.permohonanAction.update({
        where: { id: findPermohonan.id },
        data: {
          activities: payload.activities,
          updatedAt: new Date(),
          status: isLast.length === 1 ? false : true,
        },
      }),
    ]);
    await logActivity(
      req,
      "Download File",
      "PUT",
      "files",
      JSON.stringify({ status: 200, msg: "OK" }),
      `Berhasil mendownload files ${data.name}`
    );
    return NextResponse.json({ status: 200, msg: "OK" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { status: 500, msg: "Server Error" },
      { status: 500 }
    );
  }
};
