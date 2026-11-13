import { Card } from "../model/card";
import { User } from "../model/user";
import cardRepository from "../repository/card.db";

const getAllCards = async (): Promise<Card[]> => cardRepository.getAllCards();

const getCardById = async (id: number): Promise<Card | null> => {
  const card = await cardRepository.getCardById(id);
  if (!card) throw new Error(`Card with id ${id} does not exist.`);
  return card;
};

const getCardsByType = async (type: string): Promise<Card[] | null> => {
  const cards = await cardRepository.getCardsByType(type);
  if (!cards) throw new Error(`Cards with type ${type} does not exist.`);
  return cards;
};

const getCardByTypeById = async (
  type: string,
  id: number
): Promise<Card | null> => {
  const card = await cardRepository.getCardsByTypeById(type, id);
  if (!card)
    throw new Error(`Card with type ${type} and id ${id} doesn't exist.`);
  return card;
};

const resetAllCards = async (): Promise<void> => {
  await cardRepository.resetAllCards();
};

const getPlayedCards = async (): Promise<Card[]> => {
  const playedCards = await cardRepository.getPlayedCards();
  if (!playedCards) throw new Error(`Played cards do not exist.`);
  return playedCards;
};

const getChanceCardsByUser = async (user: User| null): Promise<Card[]> => {
    if(!user){
    throw new Error (`No user found.`)
  }
  const cards = await cardRepository.getChanceCardsByUser(user);
  if (!cards) throw new Error(`No chance cards found for user ${user.getCardName()}.`);
  return cards;
};

const getChestCardsByUser = async (user: User | null): Promise<Card[]> => {
  if(!user){
    throw new Error (`No user found.`)
  }
  const cards = await cardRepository.getChestCardsByUser(user);
  if (!cards) throw new Error(`No chest cards found for user ${user.getCardName()}.`);
  return cards;
};


export default {
  getAllCards,
  getCardById,
  getCardsByType,
  getCardByTypeById,
  resetAllCards,
  getPlayedCards,
  getChanceCardsByUser,
  getChestCardsByUser
};
