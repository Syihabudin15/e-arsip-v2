import { Metadata } from "next";
import { UpdatePermohonan } from "../../permohonan-kredit";

export const metadata: Metadata = { title: "Update Permohonan Kredit" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return (
    <div>
      <UpdatePermohonan id={id} />
    </div>
  );
}
