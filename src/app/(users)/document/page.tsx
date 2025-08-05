import { Metadata } from "next";
import { TableDocument } from ".";

export const metadata: Metadata = { title: "Dokument" };

export default function Page() {
  return (
    <div>
      <TableDocument />
    </div>
  );
}
