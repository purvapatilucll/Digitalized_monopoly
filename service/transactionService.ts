import { Transaction } from "../model/transaction";
import transactionDb from "../repository/transaction.db";
import userRepository from "../repository/user.db";
import { TransactionInput } from "../types";

import { PrismaClient } from "@prisma/client";
import cardRepository from "../repository/card.db";
import { randomInt } from "crypto";
import userService from "./userService";

const prisma = new PrismaClient();

// Function to get all transactions
const getAllTransactions = async (): Promise<Transaction[]> =>
  transactionDb.getAllTransactions();

/**
 * Creates a transaction between two users.
 *
 * @param senderPiece - The piece of the sender.
 * @param receiverPiece - The piece of the receiver.
 * @param amount - The amount to be transferred.
 * @returns
 */
const createTransaction = async ({
  senderCardName,
  receiverCardName,
  amount,
}: TransactionInput): Promise<Transaction> => {
  let sender;
  let receiver;

  // check if sender is bank
  if (senderCardName != "bank") {
    sender = await userRepository.getUserByCardName(senderCardName);
    if (!sender) {
      throw new Error("Invalid sender!");
    }
    transactionDb.changeBalance(sender.getCardName(), -amount, [
      ...sender.getBalanceHistory(),
      sender.getBalance() - amount,
    ]);
  } else {
    sender = await userRepository.getUserByPiece("bank");
  }

  // check if receiver is bank
  if (receiverCardName != "bank") {
    receiver = await userRepository.getUserByCardName(receiverCardName);

    if (!receiver) {
      throw new Error("Invalid receiver.");
    }
    transactionDb.changeBalance(receiver.getCardName(), amount, [
      ...receiver.getBalanceHistory(),
      receiver.getBalance() + amount,
    ]);
  } else {
    receiver = await userRepository.getUserByPiece("bank");
  }

  if (!sender || !receiver) {
    throw new Error("Invalid receiver, sender.");
  }

  const newTransaction = new Transaction({ sender, receiver, amount });
  return await transactionDb.createTransaction(newTransaction);
};

const createRouletteTransaction = async (
  senderCardName: string,
  amount: number
): Promise<Transaction> => {
  let sender;
  let receiver;
  const roulette = true;

  const gambler = await userRepository.getUserByCardName(senderCardName);
  if (!gambler) {
    throw new Error("Invalid gambler!");
  }

  const bank = await userRepository.getUserByPiece("bank");
  if (!bank) {
    throw new Error("Bank user not found.");
  }

  if (amount >= 0) {
    transactionDb.changeBalance(gambler.getCardName(), +amount, [
      ...gambler.getBalanceHistory(),
      gambler.getBalance() + amount,
    ]);
    receiver = gambler;
    sender = bank;
  } else {
    transactionDb.changeBalance(gambler.getCardName(), amount, [
      ...gambler.getBalanceHistory(),
      gambler.getBalance() + amount,
    ]);
    receiver = bank;
    sender = gambler;
  }

  if (!sender || !receiver) {
    throw new Error("Invalid sender or receiver.");
  }

  const newTransaction = new Transaction({
    sender,
    receiver,
    amount,
    roulette,
  });
  return await transactionDb.createTransaction(newTransaction);
};

/**
 * Get a random card of a specific type.
 *
 * @param cardType
 * @returns
 */
const getRandomCardOfType = async (cardType: string) => {
  const allCards = cardRepository.getAllCards();
  let correctTypeCards = (await allCards).filter(
    (anyCard) => anyCard.getType() === cardType && anyCard.getPlayed() === false
  );

  // Check if there are any unplayed cards of the correct type
  // If not, reset all cards
  if (correctTypeCards.length == 0) {
    const cardsToReset = await cardRepository.getCardsByType(cardType);
    if (!cardsToReset || cardsToReset.length === 0) {
      throw new Error("No cards found to reset.");
    }

    for (const card of cardsToReset) {
      card.setPlayed(false);
      await cardRepository.updateCard(card);
    }

    // Re-fetch or re-filter after resetting
    const refreshedCards = await cardRepository.getCardsByType(cardType);

    if (!refreshedCards || refreshedCards.length === 0) {
      throw new Error("No cards found after resetting.");
    }

    correctTypeCards = refreshedCards.filter(
      (card) => card.getPlayed() === false
    );
  }
  const index = randomInt(0, correctTypeCards.length);
  return correctTypeCards[index];
};

/**
 * Scan a card and change the balance of the user.
 *
 * @param senderPiece - The piece of the sender.
 * @param cardType - The type of the card.
 * @returns
 */
const scanCardAndChangeBalance = async (
  senderCardName: string,
  cardType: string
) => {
  const card = await getRandomCardOfType(cardType);
  const sender = await userRepository.getUserByCardName(senderCardName);
  if (!sender) {
    throw new Error("invalid sender");
  }

  const cardId = card.getId();
  if (cardId === undefined) {
    throw new Error("Card ID is undefined.");
  }
  await userService.addDrawnCardToUser(senderCardName, cardId);

  const cardEffect = card.getOutcome();
  await transactionDb.changeBalance(sender?.getCardName(), cardEffect, [
    ...sender.getBalanceHistory(),
    sender.getBalance(),
  ]);

  card.setPlayed(true);
  await cardRepository.updateCard(card);

  return card;
};

const deleteAllTransactions = async (): Promise<string> => {
  await transactionDb.deleteAllTransactions();
  return "All transactions have been deleted successfully.";
};

export default {
  getAllTransactions,
  createTransaction,
  createRouletteTransaction,
  scanCardAndChangeBalance,
  deleteAllTransactions,
};
