import { Scan } from "../model/scan";
import scanDb from "../repository/scan.db";
import userRepository from "../repository/user.db";
import { ScanInput } from "../types";

const getAllScans = async (): Promise<Scan[]> => scanDb.getAllScans();

const createScan = async ({
  userCardName,
  typeOfScan,
}: ScanInput) => {
  const user = await userRepository.getUserByCardName(userCardName);
  if (!user) {
    throw new Error("User with the given card name not found.");
  }

  const scanToCreate = new Scan({
    userCardName,
    user,
    typeOfScan,
  });
  return await scanDb.createScan(scanToCreate);
};

const deleteAllScans = async (): Promise<string> => {
  await scanDb.deleteAllScans();
  return "All scans have been deleted successfully.";
};

export default {
  getAllScans,
  createScan,
  deleteAllScans
};
