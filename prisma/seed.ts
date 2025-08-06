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
      { path: "/dashboard", access: ["read"] },
      {
        path: "/roles",
        access: ["read", "update", "write", "delete", "detail"],
      },
      {
        path: "/users",
        access: ["read", "update", "write", "delete", "detail"],
      },
      {
        path: "/jenis-pemohon",
        access: ["read", "update", "write", "delete", "detail"],
      },
      {
        path: "/permohonan-kredit",
        access: ["read", "update", "write", "delete", "detail"],
      },
      {
        path: "/document",
        access: ["read", "update", "write", "delete", "detail"],
      },
      {
        path: "/logs",
        access: ["read", "update", "write", "delete", "detail"],
      },
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
    await prisma.user.createMany({
      data: [
        {
          fullname: "SYIHABUDIN TSANI",
          username: "syihabudin",
          password: pass,
          email: "syihabudin@gmail.com",
          photo: null,

          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: roleId,
        },
        {
          fullname: "OLDYWJK",
          username: "oldy",
          password: pass,
          email: "oldy@gmail.com",
          photo: null,

          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: roleId,
        },
      ],
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
