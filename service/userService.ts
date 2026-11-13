import { Card } from "@prisma/client";
import { User } from "../model/user";
import userDb from "../repository/user.db";
import userRepository from "../repository/user.db";
import { UserInput } from "../types";
import transactionService from "./transactionService";

const getAllUsers = async (): Promise<User[]> => userRepository.getAllUsers();

const getUserById = async (id: number): Promise<User | null> => {
  const user = await userRepository.getUserById(id);
  if (!user) throw new Error(`User with id ${id} does not exist.`);
  return user;
};

const getUserByPiece = async (piece: string): Promise<User | null> => {
  const user = await userRepository.getUserByPiece(piece);
  if (!user) throw new Error(`User with piece ${piece} does not exist.`);
  return user;
};

const getUserByCardName = async (cardName: string): Promise<User | null> => {
  const user = await userRepository.getUserByCardName(cardName);
  if (!user) throw new Error(`User with card name ${cardName} does not exist.`);
  return user;
};

const createUser = async (user: User): Promise<User> => {
  const existingUser = await userRepository.getUserByPiece(user.getPiece());
  if (existingUser != null) {
    throw new Error(`User with this piece already exists.`);
  }
  return await userRepository.createUser(user);
};

const deleteUser = async (id: number): Promise<String> => {
  const existingUser = await userRepository.getUserById(id);
  if (!existingUser) {
    throw new Error(`User with ID ${id} not found.`);
  }

  await userRepository.deleteUser({ id });

  return "The user was deleted successfully.";
};

const updateUser = async (
  id: number,
  updatedData: UserInput
): Promise<User | null> => {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User with ID ${id} not found.`);
  }

  const savedUser = await userRepository.updateUser(id, updatedData);

  return savedUser;
};

const deleteAllUsers = async (): Promise<string> => {
  await userDb.deleteAllUsers();
  return "All users have been deleted successfully.";
};

const ddosUser = async (piece: string) : Promise<User | null> => {
  return await userRepository.ddosUser(piece)
}

const checkIfDdossedAndProtected = async (userCardName: string): Promise<{ ddossed: number; protected: number }> => {
  const ddossed = await userRepository.getDdossedStatusByCardName(userCardName);
  const protectedStatus = await userRepository.getProtectedStatusByCardName(userCardName);

  return {
    ddossed,
    protected: protectedStatus
  };
};

const goPastStart = async (userCardName: string): Promise<string> => {
  
  const isDdossed = await checkIfDdossedAndProtected(userCardName);
  if (isDdossed.ddossed > 0) {
    userDb.decrementDdos(userCardName)
    return "User is 1 round closer to being freed from Ddos"
  }

  const isProtected = await checkIfDdossedAndProtected(userCardName) 
  if (isProtected.protected > 0) {
  userDb.decrementProtect(userCardName)
  return "User is protected for 1 less round"
  }
  const transaction = await transactionService.createTransaction({senderCardName: "bank", receiverCardName: userCardName, amount: 2000000});

  return "User went past start (Ddos and protection) last 1 round less"

}

const addDrawnCardToUser = async(cardName: string, cardId: number): Promise<Card[] | null> => {
  return userRepository.addDrawnCardToUser(cardName, cardId)
}

const getDrawnCardsByUser = async (cardName: string) : Promise<Card[] | null> =>{
  return userRepository.getDrawnCardsByUser(cardName)
}

const protectUser = async(cardName: string) : Promise<User | null> => {
  return userRepository.protectUser(cardName);
}

export default {
  getAllUsers,
  getUserById,
  getUserByPiece,
  createUser,
  getUserByCardName,
  deleteUser,
  updateUser,
  deleteAllUsers,
  checkIfDdossedAndProtected,
  getDrawnCardsByUser,
  goPastStart,
  addDrawnCardToUser,
  ddosUser,
  protectUser
};
