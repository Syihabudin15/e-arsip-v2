import prisma from "@/components/Prisma";
import {
  getSession,
  logActivity,
  signIn,
  signOut,
} from "@/components/utils/Auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const { username, password } = await req.json();
  if (!username || !password) {
    await logActivity(
      req,
      "Gagal Login",
      "POST",
      "user",
      JSON.stringify({ status: 400, msg: "Bad Request" }),
      "Percobaan masuk gagal karena username/password tidak diinputkan"
    );
    return NextResponse.json(
      { msg: "Mohon lengkapi username & password!", status: 404 },
      { status: 404 }
    );
  }
  try {
    const find = await prisma.user.findFirst({
      where: { username: username },
      include: {
        role: true,
      },
    });
    if (!find) {
      await logActivity(
        req,
        "Gagal Login",
        "POST",
        "user",
        JSON.stringify({ status: 401, msg: "Unauthorize" }),
        "Percobaan masuk gagal karena username tidak ditemukan"
      );
      return NextResponse.json(
        { msg: "Username atau password salah!", status: 401 },
        { status: 401 }
      );
    }
    const comparePass = await bcrypt.compare(password, find.password);
    if (!comparePass) {
      await logActivity(
        req,
        "Gagal Login",
        "POST",
        "user",
        JSON.stringify({ status: 401, msg: "Unauthorize" }),
        "Percobaan masuk gagal karena passwowrd salah"
      );
      return NextResponse.json(
        { msg: "Username atau password salah!", status: 401 },
        { status: 401 }
      );
    }
    await logActivity(
      req,
      "Berhasil Login",
      "POST",
      "user",
      JSON.stringify({ status: 200, msg: "OK" }),
      "Berhasil Login",
      find.id
    );
    await signIn(find);
    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { msg: "Unauthorize", status: 401 },
      { status: 401 }
    );
  }
  try {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
      include: {
        role: true,
      },
    });
    if (!user) {
      await signOut();
      return NextResponse.json(
        { msg: "Unauthorize", status: 401 },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { data: user, status: 200, msg: "OK" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { msg: "Unauthorize", status: 401 },
        { status: 401 }
      );
    }
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
      include: {
        role: true,
      },
    });
    await logActivity(
      req,
      "Logout",
      "DELETE",
      "-",
      JSON.stringify({ status: 200, msg: "OK" }),
      "Berhasil Logout, Hapus Session",
      user?.id
    );
    await signOut();
    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};
