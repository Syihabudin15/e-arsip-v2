import cloudinary from "@/components/Cloudinary";
import { NextRequest, NextResponse } from "next/server";

/*
Resource type:
image -> Image
video -> video
raw   -> pdf
*/

export const POST = async (req: NextRequest) => {
  const { file, folder, resourcetype, fileType, publicId } = await req.json();
  if (!file || !folder || !fileType)
    return NextResponse.json(
      { data: null, status: 400, msg: "File/Folder/fileType tidak diisi" },
      { status: 400 }
    );
  try {
    const result = await cloudinary.uploader.upload(
      `data:${fileType};base64,${file}`,
      {
        folder: folder,
        resource_type: resourcetype,
        public_id: publicId,
      }
    );
    if (!result.secure_url) {
      return NextResponse.json(
        { data: null, status: 400, msg: "Gagal upload file" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { data: result.secure_url, status: 200, msg: "OK" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { data: null, status: 500, msg: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { publicId, resourcetype } = await req.json();
  if (!publicId || !resourcetype)
    return NextResponse.json(
      {
        data: null,
        status: 400,
        msg: "Url / Resource Type tidak terdeteksi",
      },
      { status: 400 }
    );
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourcetype,
    });
    return NextResponse.json(
      { data: null, status: 200, msg: "Berhasil hapus file" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { data: null, status: 500, msg: "Internal server error" },
      { status: 500 }
    );
  }
};
