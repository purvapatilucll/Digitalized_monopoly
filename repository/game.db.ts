import database from "./database";
import { Game } from "../model/game";

const endGame = async (): Promise<Game> => {
  const activeGame = await database.game.findFirst({
    where: { isOver: false },
  });

  if (!activeGame) throw new Error("No active game found.");

  const gameData =  await database.game.update({
    where: { id: activeGame.id },
    data: { isOver: true, endedAt: new Date() },
  });

  return Game.from(gameData)
};

const getCurrentGame = async (): Promise<Game|null> => {
  const game = await database.game.findFirst({
    where: { isOver: false },
  });

  return game ? Game.from(game) : null;
};

const createGame = async (winStrat: string): Promise<Game> => {
  const game = await database.game.create({
    data: {winStrat}
  });

  return Game.from(game);
}

export default {
  endGame,
  getCurrentGame,
  createGame,
};
