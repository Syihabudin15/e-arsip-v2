import { Metadata } from "next";
import { TablePermohonanKredit } from ".";

export const metadata: Metadata = { title: "Permohonan Kredit" };

export default function Page() {
  return (
    <div>
      <TablePermohonanKredit />
    </div>
  );
}
