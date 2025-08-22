import { Metadata } from "next";
import { TableDocument } from ".";

export const metadata: Metadata = { title: "Dokumen" };

export default function Page() {
  return (
    <div>
      <TableDocument />
    </div>
  );
}
