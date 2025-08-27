import cloudinary from "@/components/Cloudinary";
import {
  EditActivity,
  IPermohonanAction,
  IRootFiles,
} from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { ENeedAction, Files, StatusAction } from "@prisma/client";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const saved = await prisma.permohonanAction.create({
      data: {
        ...data,
        Files: { connect: data.Files.map((d: Files) => ({ id: d.id })) },
      },
    });
    const find = await prisma.permohonan.findFirst({
      where: { id: data.permohonanId },
    });
    if (find) {
      const temp = find.activity
        ? (JSON.parse(find.activity) as EditActivity[])
        : [];
      temp.push({
        time: moment().tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm"),
        desc: `User id [${data.requesterId}] Memohon ${
          data.action
        } Files: ${data.Files.map((d: Files) => d.name).join(",")}`,
      });
      await prisma.permohonan.update({
        where: { id: find.id },
        data: { activity: JSON.stringify(temp) },
      });
    }
    await logActivity(
      req,
      `Permohonan ${data.action} File`,
      "POST",
      "permohonanAction",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil mengajukan permohonan ${data.action} file ` +
        data.Files.map((d: any) => d.name).join(",")
    );
    return NextResponse.json(
      { data: saved, msg: "OK", status: 201 },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error", status: 500 },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const isActive: string | undefined = <any>(
    req.nextUrl.searchParams.get("isActive")
  );
  const status: StatusAction | undefined = <any>(
    req.nextUrl.searchParams.get("status")
  );
  const action: ENeedAction | undefined = <any>(
    req.nextUrl.searchParams.get("action")
  );
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  try {
    const find = await prisma.permohonanAction.findMany({
      where: {
        ...(search && {
          Permohonan: {
            OR: [
              {
                Pemohon: {
                  OR: [
                    { fullname: { contains: search } },
                    { NIK: { contains: search } },
                    { noCIF: { contains: search } },
                  ],
                },
              },
              { accountNumber: { contains: search } },
            ],
          },
        }),
        ...(status && { statusAction: status }),
        ...(action && { action: action }),
        ...(isActive && { status: isActive === "1" ? true : false }),
      },
      include: {
        Files: {
          include: {
            Permohonan: true,
            RootFiles: true,
            PermohonanAction: true,
          },
        },
        Requester: true,
        Approver: true,
        Permohonan: {
          include: {
            Pemohon: {
              include: {
                JenisPemohon: true,
              },
            },
            Produk: true,
          },
        },
      },
      take: pageSize,
      skip: skip,
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.permohonanAction.count({
      where: {
        ...(search && {
          Permohonan: {
            OR: [
              {
                Pemohon: {
                  OR: [
                    { fullname: { contains: search } },
                    { NIK: { contains: search } },
                    { noCIF: { contains: search } },
                  ],
                },
              },
              { accountNumber: { contains: search } },
            ],
          },
        }),
        ...(status && { statusAction: status }),
        ...(action && { action: action }),
        ...(isActive && { status: isActive === "1" ? true : false }),
      },
    });

    const newData: IPermohonanAction[] = <any>find.map((f) => {
      const root: IRootFiles[] = [];
      for (const files of f.Files) {
        root.push({
          id: files.RootFiles.id,
          name: files.RootFiles.name,
          Files: [files],
          order: files.RootFiles.order,
          produkType: files.RootFiles.produkType,
          resourceType: files.RootFiles.resourceType,
          status: files.RootFiles.status,
        });
      }
      return { ...f, RootFiles: root };
    });

    return NextResponse.json(
      { data: newData, total, msg: "OK", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const data: IPermohonanAction = await req.json();
  try {
    const { id, Approver, Requester, Permohonan, RootFiles, ...savedData } =
      data;

    // ADD ACTIVITY
    const find = await prisma.permohonan.findFirst({
      where: { id: data.permohonanId },
    });
    if (find) {
      const temp = find.activity
        ? (JSON.parse(find.activity) as EditActivity[])
        : [];
      temp.push({
        time: moment().tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm"),
        desc: `[${data.approverId}] Melakukan proses (${data.statusAction}) ${
          data.action
        } Files : ${RootFiles.flatMap((r) => r.Files)
          .map((d: Files) => d.name)
          .join(",")}`,
      });
      await prisma.permohonan.update({
        where: { id: find.id },
        data: { activity: JSON.stringify(temp) },
      });
    }

    const Files = RootFiles.flatMap((r) => r.Files);
    if (data.statusAction === StatusAction.APPROVED) {
      await prisma.permohonanAction.update({
        where: { id: id },
        data: {
          statusAction: data.statusAction,
          description: data.description,
          approverId: data.approverId,
          activities: data.activities,
        },
      });
      if (data.action === ENeedAction.DOWNLOAD) {
        await prisma.$transaction([
          ...Files.map((rf) =>
            prisma.files.update({
              where: { id: rf.id },
              data: {
                allowDownload: rf.allowDownload + `${data.requesterId},`,
              },
            })
          ),
        ]);
      } else {
        await prisma.$transaction([
          ...Files.map((rf) =>
            prisma.files.update({
              where: { id: rf.id },
              data: {
                permohonanId: null,
              },
            })
          ),
        ]);
        for (const file of Files) {
          await cloudinary.uploader.destroy(file.url);
        }
      }
      await logActivity(
        req,
        `Proses Permohonan ${data.action} File`,
        "PUT",
        "permohonanAction",
        JSON.stringify({ status: 201, msg: "OK" }),
        `Berhasil proses pengajuan ${data.action} file ${data.RootFiles.flatMap(
          (d: any) => d.name
        ).join(",")} (${Files.map((f) => f.name).join(",")})`
      );
      return NextResponse.json({ data: null, status: 201 }, { status: 201 });
    }

    if ("Files" in savedData) delete savedData.Files;
    await prisma.permohonanAction.update({
      where: { id: id },
      data: savedData,
    });
    await logActivity(
      req,
      `Proses Permohonan ${data.action} File`,
      "PUT",
      "permohonanAction",
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil proses pengajuan ${data.action} file ${data.RootFiles.flatMap(
        (d: any) => d.name
      ).join(",")} (${Files.map((f) => f.name).join(",")})`
    );
    return NextResponse.json({ data: null, status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error", status: 500 },
      { status: 500 }
    );
  }
};
