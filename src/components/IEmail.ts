import nodemailer from "nodemailer";

export const runtime = "nodejs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER_USER,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
});

export async function sendEmail(
  to: string | string[],
  cc: string | string[],
  subject: string,
  text: string
) {
  await transporter.sendMail({
    from: `"No-Reply" <E Arsip Official>`,
    to,
    cc,
    subject,
    html: `<div style="text-align:justify;line-height:2">${text}</div>`,
  });
}
