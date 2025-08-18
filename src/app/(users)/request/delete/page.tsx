import { Metadata } from "next";
import { TableDeletes } from ".";

export const metadata: Metadata = { title: "Permohonan Hapus Berkas" };

export default function Page() {
  return (
    <div>
      <TableDeletes />
    </div>
  );
}
