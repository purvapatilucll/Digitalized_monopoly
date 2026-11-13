import { Transaction } from "../model/transaction";
import database from "./database";

const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactionPrisma = await database.transaction.findMany({
      include: {
        sender: { include: { cards: true, stolen: true, robbed: true } },
        receiver: { include: { cards: true, stolen: true, robbed: true } },
      },
    });
    return transactionPrisma.map((transactionPrisma) =>
      Transaction.from(transactionPrisma)
    );
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const createTransaction = async (
  transaction: Transaction
): Promise<Transaction> => {
  const transactionPrisma = await database.transaction.create({
    data: {
      sender: {
        connect: { piece: transaction.getSender().getPiece() },
      },
      receiver: {
        connect: { piece: transaction.getReceiver().getPiece() },
      },
      amount: transaction.getAmount(),
      roulette: transaction.getRoulette(),
    },
    include: {
      sender: { include: { cards: true, stolen: true, robbed: true } },
      receiver: { include: { cards: true, stolen: true, robbed: true } },
    },
  });

  return Transaction.from(transactionPrisma);
};

const changeBalance = async (
  cardName: string,
  cardEffect: number,
  balanceHistory: number[]
) => {
  await database.user.update({
    where: { cardName },
    data: {
      balance: { increment: cardEffect },
      balanceHistory: balanceHistory,
    },
  });
};

export const findUserById = (userId: number) => {
  return database.user.findUnique({ where: { id: userId } });
};

export const findScanById = (scanId: number) => {
  return database.scan.findUnique({ where: { id: scanId } });
};

export const findCardById = (cardId: number) => {
  return database.card.findUnique({ where: { id: cardId } });
};

export const findBankUser = () => {
  return database.user.findUnique({ where: { piece: "bank" } });
};

const deleteAllTransactions = async (): Promise<void> => {
  await database.transaction.deleteMany({});
};

export default {
  getAllTransactions,
  createTransaction,
  changeBalance,
  findBankUser,
  findCardById,
  findScanById,
  findUserById,
  deleteAllTransactions,
};
