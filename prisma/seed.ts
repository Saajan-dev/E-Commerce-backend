import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Entering into seed file.......🤞");

  await prisma.role.create({
    data: {
      role_name: "super_admin",
    },
  });
  await prisma.role.create({
    data: {
      role_name: "admin",
    },
  });

  await prisma.role.create({
    data: {
      role_name: "user",
    },
  });
}
main()
  .then(async () => {
    console.log("Seeded Successfully.....🙏");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
