import { Metadata } from "next";
import { DeleteFiles } from ".";

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
