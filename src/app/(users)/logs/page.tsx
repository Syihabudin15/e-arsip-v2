import { Metadata } from "next";
import { TableLogs } from ".";

export const metadata: Metadata = { title: "Logs Activitas" };

export default function Page() {
  return (
    <div>
      <TableLogs />
    </div>
  );
}
