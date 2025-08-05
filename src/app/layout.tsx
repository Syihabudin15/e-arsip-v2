import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ILayout from "../components/ILayout";

const JetBrainsMono = JetBrains_Mono({
  variable: "--font-jet-brain-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_APP_SHORTNAME}`,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_SHORTNAME}`,
  },
  description: "Sistem Informasi Pembiayaan Pensiunan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${JetBrainsMono.variable} antialiased`}>
        <ILayout>{children}</ILayout>
      </body>
    </html>
  );
}
