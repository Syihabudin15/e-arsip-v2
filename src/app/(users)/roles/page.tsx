import { Metadata } from "next";
import TableRole from "./util";

export const metadata: Metadata = { title: "Manage Role" };

export default function Page() {
  return (
    <div>
      <TableRole />
    </div>
  );
}
