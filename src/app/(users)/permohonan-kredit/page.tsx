import { Metadata } from "next";
import { TablePermohonan } from ".";

export const metadata: Metadata = { title: "Permohonan Kredit" };

export default function Page() {
  return (
    <div>
      <TablePermohonan type="KREDIT" />
    </div>
  );
}
