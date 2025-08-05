import { Metadata } from "next";
import { TableRole } from ".";

export const metadata: Metadata = { title: "Manage Role" };

export default function Page() {
  return (
    <div>
      <TableRole />
    </div>
  );
}
