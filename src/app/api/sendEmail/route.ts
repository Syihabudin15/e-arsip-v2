import { sendEmail } from "@/components/IEmail";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    await sendEmail(
      process.env.EMAIL_RECEIVER_DEFAULT || "",
      "",
      data.subject,
      data.decription
    );
    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};
