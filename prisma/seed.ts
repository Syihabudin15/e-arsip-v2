// import { PrismaClient } from "@prisma/client";
import { IPermission } from "@/components/IInterfaces";
import { EProdukType, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const permision: IPermission[] = [
    { path: "/dashboard", access: ["read"] },
    {
      path: "/roles",
      access: ["read", "update", "write", "delete"],
    },
    {
      path: "/users",
      access: ["read", "update", "write", "delete"],
    },
    {
      path: "/jenis-pemohon",
      access: ["read", "update", "write", "delete"],
    },
    {
      path: "/permohonan-kredit",
      access: ["read", "update", "write", "delete", "detail", "download"],
    },
    {
      path: "/document",
      access: ["read", "update", "write", "delete", "detail", "download"],
    },
    {
      path: "/logs",
      access: ["read", "update", "write", "delete"],
    },
  ];

  const role = await prisma.role.upsert({
    where: { roleName: "ADMINISTRATOR" },
    update: {},
    create: {
      roleName: "ADMINISTRATOR",
      permission: JSON.stringify(permision),

      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  const pass = await bcrypt.hash("Tsani182", 10);
  await prisma.user.upsert({
    where: { username: "syihabudin" },
    update: {},
    create: {
      fullname: "SYIHABUDIN TSANI",
      username: "syihabudin",
      password: pass,
      email: "syihabudin@gmail.com",
      photo: null,

      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: role.id,
    },
  });
  await prisma.user.upsert({
    where: { username: "oldy" },
    update: {},
    create: {
      fullname: "OLDYWJK",
      username: "oldy",
      password: pass,
      email: "oldy@gmail.com",
      photo: null,

      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: role.id,
    },
  });

  await prisma.jenisPemohon.upsert({
    where: { name: "PERORANGAN" },
    update: {},
    create: {
      name: "PERORANGAN",
      keterangan: "",
    },
  });
  await prisma.jenisPemohon.upsert({
    where: { name: "BADAN USAHA" },
    update: {},
    create: {
      name: "BADAN USAHA",
      keterangan: "",
    },
  });

  const produks = [
    {
      code: "Tabrima",
      name: "Tabrima",
      produkType: EProdukType.TABUNGAN,
    },
    {
      code: "TabKu",
      name: "TabunganKu",
      produkType: EProdukType.TABUNGAN,
    },
    {
      code: "TabEsc",
      name: "Tabungan Escrow",
      produkType: EProdukType.TABUNGAN,
    },
    {
      code: "Dep1",
      name: "Dep 1 Bulan",
      produkType: EProdukType.DEPOSITO,
    },
    {
      code: "Dep3",
      name: "Dep 3 Bulan",
      produkType: EProdukType.DEPOSITO,
    },
    {
      code: "Dep6",
      name: "Dep 6 Bulan",
      produkType: EProdukType.DEPOSITO,
    },
    {
      code: "Dep12",
      name: "Dep 12 Bulan",
      produkType: EProdukType.DEPOSITO,
    },
    {
      code: "KREDIT",
      name: "KREDIT",
      produkType: EProdukType.KREDIT,
    },
  ];

  await Promise.all(
    produks.map((rf) =>
      prisma.produk.upsert({
        where: { code: rf.code },
        update: {},
        create: rf,
      })
    )
  );
  const rootFilesSeed = [
    {
      name: "File Identitas",
      order: 1,
      produkType: EProdukType.KREDIT,
      resourceType: "application/pdf",
    },
    {
      name: "File Kredit",
      order: 2,
      produkType: EProdukType.KREDIT,
      resourceType: "application/pdf",
    },
    {
      name: "File Jaminan",
      order: 3,
      produkType: EProdukType.KREDIT,
      resourceType: "application/pdf",
    },
    {
      name: "File SLIK",
      order: 4,
      produkType: EProdukType.KREDIT,
      resourceType: "application/pdf",
    },
    {
      name: "File Legal",
      order: 5,
      produkType: EProdukType.KREDIT,
      resourceType: "application/pdf",
    },
    {
      name: "File Kepatuhan",
      order: 6,
      produkType: EProdukType.KREDIT,
      resourceType: "application/pdf",
    },
    {
      name: "File Custody",
      order: 7,
      produkType: EProdukType.KREDIT,
      resourceType: "application/pdf",
    },
    {
      name: "T Form Permohonan",
      order: 8,
      produkType: EProdukType.TABUNGAN,
      resourceType: "application/pdf",
    },
    {
      name: "T Foto Nasabah",
      order: 9,
      produkType: EProdukType.TABUNGAN,
      resourceType: "image/png,image/jpg,image/jpeg",
    },
    {
      name: "T Speciment TTD",
      order: 10,
      produkType: EProdukType.TABUNGAN,
      resourceType: "application/pdf",
    },
    {
      name: "D Form Permohonan",
      order: 11,
      produkType: EProdukType.DEPOSITO,
      resourceType: "application/pdf",
    },
    {
      name: "D Foto Nasabah",
      order: 12,
      produkType: EProdukType.DEPOSITO,
      resourceType: "image/png,image/jpg,image/jpeg",
    },
    {
      name: "D Speciment TTD",
      order: 13,
      produkType: EProdukType.DEPOSITO,
      resourceType: "application/pdf",
    },
    {
      name: "Bilyet",
      order: 14,
      produkType: EProdukType.DEPOSITO,
      resourceType: "application/pdf",
    },
  ];

  await Promise.all(
    rootFilesSeed.map((rf) =>
      prisma.rootFiles.upsert({
        where: { name: rf.name },
        update: {},
        create: rf,
      })
    )
  );
  console.log("Seeding succeesfully...");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
