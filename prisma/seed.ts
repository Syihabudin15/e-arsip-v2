// import { PrismaClient } from "@prisma/client";
import { IPermission } from "@/components/IInterfaces";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const roleFind = await prisma.role.findFirst({
    where: { roleName: "ADMINISTRATOR" },
  });
  let roleId = roleFind ? roleFind.id : 1;
  if (!roleFind) {
    const permision: IPermission[] = [
      { path: "/", access: ["read"] },
      { path: "/role", access: ["read", "write", "delete"] },
      { path: "/user", access: ["read", "write", "delete"] },
      { path: "/jenis-pemohon", access: ["read", "write", "delete"] },
      { path: "/permohonan-kredit", access: ["read", "write", "delete"] },
      { path: "/dokumen", access: ["read", "write", "delete"] },
    ];

    const roleSaved = await prisma.role.create({
      data: {
        roleName: "ADMINISTRATOR",
        permission: JSON.stringify(permision),

        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    roleId = roleSaved.id;
  }
  const findUser = await prisma.user.findFirst({
    where: { username: "syihabudin" },
  });
  if (!findUser) {
    const pass = await bcrypt.hash("Tsani182", 10);
    await prisma.user.create({
      data: {
        fullname: "Syihabudin Tsani",
        username: "syihabudin",
        password: pass,
        email: "syihabudin@gmail.com",
        photo: null,

        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: roleId,
      },
    });
  }
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
