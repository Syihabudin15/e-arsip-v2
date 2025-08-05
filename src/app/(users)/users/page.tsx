import { Metadata } from "next";
import { TableUser } from ".";

export const metadata: Metadata = { title: "Manage Users" };

export default function Page() {
  return (
    <div>
      <TableUser />
    </div>
  );
}
