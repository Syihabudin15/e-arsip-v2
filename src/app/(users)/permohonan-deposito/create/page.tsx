import { Metadata } from "next";
import { CreatePermohonan } from "../../permohonan-kredit";

export const metadata: Metadata = { title: "Tambah Permohonan Kredit" };

export default function Page() {
  return (
    <div>
      <CreatePermohonan type="DEPOSITO" />
    </div>
  );
}
