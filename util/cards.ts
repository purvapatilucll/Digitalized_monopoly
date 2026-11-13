import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

const main = async () => {
  await prisma.scan.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  await prisma.card.deleteMany();
};

(async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
