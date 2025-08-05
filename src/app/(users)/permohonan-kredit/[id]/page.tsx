import { Metadata } from "next";
import { UpdatePermohonanKredit } from ".";

export const metadata: Metadata = { title: "Update Permohonan Kredit" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return (
    <div>
      <UpdatePermohonanKredit id={id} />
    </div>
  );
}
