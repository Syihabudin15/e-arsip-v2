import { DeleteFiles } from "@/app/(users)/permohonan-kredit";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Hapus Berkas" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return (
    <div>
      <DeleteFiles id={id} />
    </div>
  );
}
