import { Metadata } from "next";
import { TableRootFiles } from ".";

export const metadata: Metadata = { title: "Manage File" };

export default function Page() {
  return (
    <div>
      <TableRootFiles />
    </div>
  );
}
