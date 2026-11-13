import { User } from "../model/user";
import { Card } from "../model/card";
import database from "./database";

const getAllCards = async (): Promise<Card[]> => {
  try {
    const cardPrisma = await database.card.findMany();
    return cardPrisma.map((cardPrisma) => Card.from(cardPrisma));
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getCardById = async (id: number): Promise<Card | null> => {
  try {
    const cardPrisma = await database.card.findUnique({
      where: { id },
    });

    return cardPrisma ? Card.from(cardPrisma) : null;
  } catch (error) {
    console.error(error);
    console.log("getCardById called with:", id);
    throw new Error("Database error. See server log for details.");
  }
};

const getCardsByType = async (type: string): Promise<Card[] | null> => {
  try {
    const cardPrisma = await database.card.findMany({
      where: { type },
    });

    return cardPrisma.map((cardPrisma) => Card.from(cardPrisma));
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getCardsByTypeById = async (
  type: string,
  id: number
): Promise<Card | null> => {
  try {
    const cardPrisma = await database.card.findUnique({
      where: { type, id },
    });
    return cardPrisma ? Card.from(cardPrisma) : null;
  } catch (error) {
    console.log(error);
    throw new Error("Database error. See server log for details.");
  }
};

const updateCard = async (card: Card): Promise<Card> => {
  try {
    const cardPrisma = await database.card.update({
      where: { id: card.getId() },
      data: {
        message: card.getMessage(),
        outcome: card.getOutcome(),
        type: card.getType(),
        played: card.getPlayed(),
      },
    });
    return Card.from(cardPrisma);
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const resetAllCards = async (): Promise<void> => {
  try {
    await database.card.updateMany({
      data: {
        played: false,
      },
    });
  } catch (error) {
    console.error("Reset cards failed with:", error);
    throw new Error("Database error. See server log for details.");
  }
};

const getPlayedCards = async (): Promise<Card[]> => {
  try {
    const playedCards = await database.card.findMany({
      where: { played: true },
    });
    return playedCards.map((cardPrisma) => Card.from(cardPrisma));
  } catch (error) {
    console.error("getPlayedCards failed with:", error);
    throw new Error("Database error. See server log for details.");
  }
};

const getCardsByUser = async (user: User): Promise<Card[]> => {
  try {
    const cards = await database.card.findMany({
      where: { userCardName: user.getCardName() },
    });
    return cards.map((cardPrisma) => Card.from(cardPrisma));
  } catch (error) {
    console.error("getCardsByUser failed with:", error);
    throw new Error("Database error. See server log for details.");
  }
};

const getChanceCardsByUser = async (user: User): Promise<Card[]> => {
  try {
    const cards = await database.card.findMany({
      where: {
        userCardName: user.getCardName(),
        type: "chance",
      },
    });
    return cards.map((cardPrisma) => Card.from(cardPrisma));
  } catch (error) {
    console.error("getChanceCardsByUser failed with:", error);
    throw new Error("Database error. See server log for details.");
  }
};

const getChestCardsByUser = async (user: User): Promise<Card[]> => {
  try {
    const cards = await database.card.findMany({
      where: {
        userCardName: user.getCardName(),
        type: "chest",
      },
    });
    return cards.map((cardPrisma) => Card.from(cardPrisma));
  } catch (error) {
    console.error("getChestCardsByUser failed with:", error);
    throw new Error("Database error. See server log for details.");
  }
};


export default {
  getAllCards,
  getCardById,
  getCardsByType,
  getCardsByTypeById,
  updateCard,
  resetAllCards,
  getPlayedCards,
  getCardsByUser,
  getChanceCardsByUser,
  getChestCardsByUser
};
