import { Metadata } from "next";
import { TableProduk } from ".";

export const metadata: Metadata = { title: "Produk" };

export default function Page() {
  return (
    <div className="p-1">
      <TableProduk />
    </div>
  );
}
