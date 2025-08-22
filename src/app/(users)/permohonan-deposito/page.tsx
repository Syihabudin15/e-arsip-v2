import { Metadata } from "next";
import { TablePermohonan } from "../permohonan-kredit";

export const metadata: Metadata = { title: "Tabungan" };

export default function Page() {
  return (
    <div>
      <TablePermohonan type="DEPOSITO" />
    </div>
  );
}
