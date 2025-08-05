import { Metadata } from "next";
import { UpsertRole } from "..";

export const metadata: Metadata = { title: "Upsert Role" };

export default function Page() {
  return (
    <div>
      <UpsertRole />
    </div>
  );
}
