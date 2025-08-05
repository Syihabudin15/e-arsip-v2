import { Metadata } from "next";
import { TableJenisPemohon } from ".";

export const metadata: Metadata = { title: "Jenis Pemohon" };

export default function Page() {
  return (
    <div>
      <TableJenisPemohon />
    </div>
  );
}
