import { Metadata } from "next";
import { CreatePermohonanKredit } from "..";

export const metadata: Metadata = { title: "Tambah Permohonan Kredit" };

export default function Page() {
  return (
    <div>
      <CreatePermohonanKredit />
    </div>
  );
}
