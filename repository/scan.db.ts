import { Scan } from "../model/scan";
import database from "./database";

const getAllScans = async (): Promise<Scan[]> => {
  try {
    const scanPrisma = await database.scan.findMany({
      include: {
        user: { include: { cards: true, stolen: true, robbed: true } },
      },
    });
    return scanPrisma.map((scanPrisma) => Scan.from(scanPrisma));
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const createScan = async (scan: Scan): Promise<Scan> => {
  const scanPrisma = await database.scan.create({
    data: {
      userCardName: scan.getUserCardName(),
      typeOfScan: scan.getTypeOfScan(),
    },
    include: {
      user: { include: { cards: true, stolen: true, robbed: true } },
    },
  });

  return Scan.from(scanPrisma);
};

const deleteAllScans = async (): Promise<void> => {
  await database.scan.deleteMany({});
};

export default {
  getAllScans,
  createScan,
  deleteAllScans,
};
