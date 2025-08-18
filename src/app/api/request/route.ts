// import { SelectedFIles } from "@/app/(users)/permohonan-kredit/delete/[id]/util";
import cloudinary from "@/components/Cloudinary";
import { sendEmail } from "@/components/IEmail";
import { IFileList } from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { logActivity } from "@/components/utils/Auth";
import { PermohonanAction, StatusAction } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const saved = await prisma.permohonanAction.createMany({ data });
    await logActivity(
      req,
      `Permohonan ${data.action} File`,
      "POST",
      "permohonanAction",
      JSON.stringify(data),
      JSON.stringify({ status: 201, msg: "OK" }),
      `Berhasil mengajukan permohonan ${data.action} file ` +
        data.map((d: any) => d.rootFilename).join(",")
    );
    await sendEmail(
      process.env.EMAIL_RECEIVER_DEFAULT || "",
      "",
      `Permohnan ${data.action} File`,
      `Ada Permohonan baru untuk ${data.action} file`
    );
    return NextResponse.json(
      { data: saved, msg: "OK", status: 201 },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    await logActivity(
      req,
      `Permohonan ${data.action} File Gagal`,
      "POST",
      "permohonanAction",
      JSON.stringify(data),
      JSON.stringify({ status: 500, msg: "Server Error" }),
      `Gagal mengajukan permohonan ${data.action} file ` +
        data.map((d: any) => d.rootFilename).join(",")
    );
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
  const status: StatusAction | undefined = <any>(
    req.nextUrl.searchParams.get("status")
  );
  const action: string | undefined = <any>(
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
          OR: [
            { rootFilename: { contains: search } },
            {
              Document: {
                PermohonanKredit: {
                  some: {
                    OR: [
                      { fullname: { contains: search } },
                      { NIK: { contains: search } },
                    ],
                  },
                },
              },
            },
          ],
        }),

        ...(status && { statusAction: status }),
        ...(action && { action: action }),
      },
      include: {
        Document: {
          include: {
            PermohonanKredit: true,
          },
        },
        Requester: true,
        Approver: true,
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.permohonanAction.count({
      where: {
        ...(search && {
          OR: [
            { rootFilename: { contains: search } },
            {
              Document: {
                PermohonanKredit: {
                  some: {
                    OR: [
                      { fullname: { contains: search } },
                      { NIK: { contains: search } },
                    ],
                  },
                },
              },
            },
          ],
        }),
        ...(status && { statusAction: status }),
        ...(action && { action: action }),
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

export const PUT = async (req: NextRequest) => {
  const data: PermohonanAction = await req.json();
  try {
    const rootFilename = data.rootFilename
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "") // buang karakter aneh
      .replace(/ (.)/g, (match, group1) => group1.toUpperCase());
    // Updated Data
    const { id, ...updatedData } = data;

    if (data.action === "DELETE") {
      if (data.statusAction === StatusAction.APPROVED) {
        const findDoc = await prisma.document.findFirst({
          where: { id: data.documentId },
        });
        if (!findDoc) {
          return NextResponse.json(
            { msg: "Document tidak ditemukan!", status: 400 },
            { status: 400 }
          );
        }
        const findDocFiles: IFileList[] = JSON.parse(
          (findDoc as any)[rootFilename]
        );
        const mapping: IFileList[] = JSON.parse(data.files);
        const filtered: IFileList[] = findDocFiles.filter(
          (docFile) =>
            !mapping.some(
              (mapFile) => mapFile.file === docFile.file // bandingkan field unik
            )
        );
        // hard update findDoc
        (findDoc as any)[rootFilename] = JSON.stringify(filtered);
        // Save to DB
        const { id: idDoc, ...updatedDoc } = findDoc;
        await prisma.$transaction([
          prisma.document.update({
            where: { id: findDoc.id },
            data: updatedDoc,
          }),
          prisma.permohonanAction.update({
            where: { id: data.id },
            data: { ...updatedData, updatedAt: new Date() },
          }),
        ]);
        for (const file of mapping) {
          await cloudinary.uploader.destroy(file.file, {
            resource_type: "raw",
          });
        }
        await logActivity(
          req,
          "Permohonan Hapus File",
          "PUT",
          "permohonanAction",
          JSON.stringify(data),
          JSON.stringify({ status: 201, msg: "OK" }),
          "Berhasil proses permohonan hapus file " + data.rootFilename
        );
        await sendEmail(
          process.env.EMAIL_RECEIVER_DEFAULT || "",
          "",
          "Permohnan Hapus File",
          "Ada Permohonan baru untuk penghapusan file"
        );
        return NextResponse.json(
          { data: findDoc, msg: "OK", status: 201 },
          { status: 201 }
        );
      } else {
        const saved = await prisma.permohonanAction.update({
          where: { id: data.id },
          data: { ...updatedData, updatedAt: new Date() },
        });
        await logActivity(
          req,
          "Permohonan Hapus File",
          "PUT",
          "permohonanAction",
          JSON.stringify(data),
          JSON.stringify({ status: 201, msg: "OK" }),
          "Berhasil proses permohonan hapus file " + data.rootFilename
        );
        return NextResponse.json(
          { data: saved, msg: "OK", status: 201 },
          { status: 201 }
        );
      }
    } else {
      if (data.statusAction === "APPROVED") {
        const findDoc = await prisma.document.findFirst({
          where: { id: data.documentId },
        });
        if (!findDoc) {
          return NextResponse.json(
            { msg: "Document tidak ditemukan!", status: 400 },
            { status: 400 }
          );
        }
        const findDocFiles: IFileList[] = JSON.parse(
          (findDoc as any)[rootFilename]
        );
        const mapping: IFileList[] = JSON.parse(data.files);
        const filtered: IFileList[] = findDocFiles.map((docFile) => {
          if (
            mapping.some(
              (mapFile) => mapFile.file === docFile.file // bandingkan field unik
            )
          ) {
            docFile.allowedDownload =
              docFile.allowedDownload + `,${data.requesterId}`;
          }
          return docFile;
        });
        // hard update findDoc
        (findDoc as any)[rootFilename] = JSON.stringify(filtered);
        // Save to DB
        const { id: idDoc, ...updatedDoc } = findDoc;
        await prisma.$transaction([
          prisma.document.update({
            where: { id: findDoc.id },
            data: updatedDoc,
          }),
          prisma.permohonanAction.update({
            where: { id: data.id },
            data: { ...updatedData, updatedAt: new Date() },
          }),
        ]);
        await logActivity(
          req,
          "Permohonan Download File",
          "PUT",
          "permohonanAction",
          JSON.stringify(data),
          JSON.stringify({ status: 201, msg: "OK" }),
          "Berhasil proses permohonan Download file " + data.rootFilename
        );
        await sendEmail(
          process.env.EMAIL_RECEIVER_DEFAULT || "",
          "",
          "Permohnan Download File",
          "Ada Permohonan baru untuk download file"
        );
        return NextResponse.json(
          { data: findDoc, msg: "OK", status: 201 },
          { status: 201 }
        );
      } else {
        const saved = await prisma.permohonanAction.update({
          where: { id: data.id },
          data: { ...updatedData, updatedAt: new Date() },
        });
        await logActivity(
          req,
          "Permohonan Download File",
          "PUT",
          "permohonanAction",
          JSON.stringify(data),
          JSON.stringify({ status: 201, msg: "OK" }),
          "Berhasil proses permohonan download file " + data.rootFilename
        );
        return NextResponse.json(
          { data: saved, msg: "OK", status: 201 },
          { status: 201 }
        );
      }
    }
  } catch (err) {
    console.log(err);
    await logActivity(
      req,
      `Permohnan ${data.action} File`,
      "PUT",
      "permohonanAction",
      JSON.stringify(data),
      JSON.stringify({ status: 500, msg: "Server Error" }),
      `Gagal proses permohonan ${data.action} file ` + data.rootFilename
    );
    return NextResponse.json(
      { msg: "Server Error", status: 500 },
      { status: 500 }
    );
  }
};
