import { Metadata } from "next";
import { CreatePermohonan } from "..";

export const metadata: Metadata = { title: "Tambah Permohonan Kredit" };

export default function Page() {
  return (
    <div>
      <CreatePermohonan type="KREDIT" />
    </div>
  );
}
