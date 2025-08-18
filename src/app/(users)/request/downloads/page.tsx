import { Metadata } from "next";
import { TableDownload } from ".";

export const metadata: Metadata = { title: "Permohonan Download Berkas" };

export default function Page() {
  return (
    <div>
      <TableDownload />
    </div>
  );
}
